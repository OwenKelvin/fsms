import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BufferedFile, FileUploadService } from '@fsms/backend/file-upload';
import {
  DocumentType,
  DocumentVerificationStatus,
  FileUploadModel,
  RegistrationDocumentModel,
  RegistrationRecordModel,
  RegistrationStatus,
} from '@fsms/backend/db';
import { Transaction } from 'sequelize';
import { EmailService } from '@fsms/backend/email-service';

export interface DocumentUploadResult {
  documentId: string;
  fileUploadId: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface DocumentReviewFlag {
  documentId: string;
  flagReason: string;
  flaggedAt: Date;
  requiresManualReview: boolean;
}

export interface DocumentValidationResult {
  isValid: boolean;
  errors: string[];
  reviewFlags?: DocumentReviewFlag[];
}

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    private readonly fileUploadService: FileUploadService,
    @InjectModel(RegistrationDocumentModel)
    private readonly registrationDocumentModel: typeof RegistrationDocumentModel,
    @InjectModel(FileUploadModel)
    private readonly fileUploadModel: typeof FileUploadModel,
    @InjectModel(RegistrationRecordModel)
    private readonly registrationRecordModel: typeof RegistrationRecordModel,
    private readonly emailService: EmailService,
  ) {
    this.logger.log('DocumentService initialized');
  }

  /**
   * Uploads a registration document with document type validation
   * Requirements: 3.1, 3.2
   */
  async uploadRegistrationDocument(
    file: BufferedFile,
    documentType: DocumentType,
    registrationId: string,
    transaction?: Transaction,
  ): Promise<DocumentUploadResult> {
    this.logger.log(
      `Uploading document for registration ${registrationId}, type: ${documentType}`,
    );

    // Validate document type and file
    const validation = await this.validateDocumentType(
      file.mimetype,
      documentType,
    );
    if (!validation.isValid) {
      this.logger.warn(
        `Document validation failed for registration ${registrationId}: ${validation.errors.join(', ')}`,
      );
      throw new BadRequestException(
        `Document validation failed: ${validation.errors.join(', ')}`,
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      this.logger.warn(
        `File size exceeds limit for registration ${registrationId}: ${file.size} bytes`,
      );
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    try {
      // Upload file using existing FileUploadService
      const fileName = await this.fileUploadService.upload(file);
      this.logger.debug(`File uploaded to storage: ${fileName}`);

      // Create file upload record
      const fileUploadRecord = await this.fileUploadModel.create(
        {
          name: fileName,
          encoding: file.encoding,
          size: file.size,
          mimetype: file.mimetype,
          originalName: file.originalName,
        },
        { transaction },
      );

      // Link document to registration
      const registrationDocument = await this.linkDocumentToRegistration(
        fileUploadRecord.id,
        registrationId,
        documentType,
        transaction,
      );

      this.logger.log(
        `Document uploaded successfully for registration ${registrationId}: Document ID ${registrationDocument.id}`,
      );

      return {
        documentId: registrationDocument.id,
        fileUploadId: fileUploadRecord.id,
        documentType,
        fileName,
        fileSize: file.size,
        uploadedAt: registrationDocument.uploadedAt,
      };
    } catch (error) {
      this.logger.error(
        `Error uploading document for registration ${registrationId}:`,
        error,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Error uploading document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Validates document type and file format
   * Requirements: 3.2, 3.4
   */
  async validateDocumentType(
    mimetype: string,
    documentType: DocumentType,
  ): Promise<DocumentValidationResult> {
    const errors: string[] = [];

    // Validate document type
    if (!Object.values(DocumentType).includes(documentType)) {
      errors.push('Invalid document type');
    }

    // Validate file type - now supports PDF, JPG, and PNG
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (!allowedMimeTypes.includes(mimetype.toLowerCase())) {
      errors.push('File type must be PDF, JPG, or PNG');
    }

    // Additional validation based on document type
    if (documentType === DocumentType.ACCREDITATION_CERTIFICATE) {
      // Accreditation certificates are typically PDF documents
      if (mimetype.toLowerCase() !== 'application/pdf') {
        errors.push('Accreditation certificates should be in PDF format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Links a document to a registration record
   * Requirements: 3.5
   */
  async linkDocumentToRegistration(
    fileUploadId: string,
    registrationId: string,
    documentType: DocumentType,
    transaction?: Transaction,
  ): Promise<RegistrationDocumentModel> {
    // Check if document of this type already exists for this registration
    const existingDocument = await this.registrationDocumentModel.findOne({
      where: {
        registrationId,
        documentType,
      },
      transaction,
    });

    if (existingDocument) {
      // Update existing document with new file
      await existingDocument.update(
        {
          fileUploadId,
          verificationStatus: DocumentVerificationStatus.PENDING,
          uploadedAt: new Date(),
          verifiedAt: null,
          verifiedBy: null,
        },
        { transaction },
      );

      return existingDocument;
    } else {
      // Create new document record
      return await this.registrationDocumentModel.create(
        {
          documentType,
          verificationStatus: DocumentVerificationStatus.PENDING,
          fileUploadId,
          registrationId,
          uploadedAt: new Date(),
        },
        { transaction },
      );
    }
  }

  /**
   * Gets a secure URL for downloading a document
   */
  async getDocumentUrl(documentId: string): Promise<string> {
    const document = await this.registrationDocumentModel.findByPk(documentId, {
      include: [{ model: this.fileUploadModel }],
    });

    if (!document || !document.fileUpload) {
      throw new BadRequestException('Document not found');
    }

    // For now, return the file name - in a real implementation,
    // this would generate a signed URL from MinIO
    return document.fileUpload.name || '';
  }

  /**
   * Deletes a document and its associated file
   */
  async deleteDocument(
    documentId: string,
    transaction?: Transaction,
  ): Promise<void> {
    const document = await this.registrationDocumentModel.findByPk(documentId, {
      include: [{ model: this.fileUploadModel }],
      transaction,
    });

    if (!document) {
      throw new BadRequestException('Document not found');
    }

    try {
      // Delete file from storage
      if (document.fileUpload?.name) {
        await this.fileUploadService.delete(document.fileUpload.name);
      }

      // Delete file upload record
      if (document.fileUpload) {
        await document.fileUpload.destroy({ transaction });
      }

      // Delete document record
      await document.destroy({ transaction });
    } catch (error) {
      throw new HttpException(
        'Error deleting document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Gets all documents for a registration
   */
  async getRegistrationDocuments(
    registrationId: string,
  ): Promise<RegistrationDocumentModel[]> {
    return await this.registrationDocumentModel.findAll({
      where: { registrationId },
      include: [{ model: this.fileUploadModel }],
      order: [['uploadedAt', 'DESC']],
    });
  }

  /**
   * Updates document verification status
   */
  async updateDocumentVerificationStatus(
    documentId: string,
    status: DocumentVerificationStatus,
    verifiedBy?: string,
    transaction?: Transaction,
  ): Promise<void> {
    const document = await this.registrationDocumentModel.findByPk(documentId, {
      transaction,
    });

    if (!document) {
      throw new BadRequestException('Document not found');
    }

    await document.update(
      {
        verificationStatus: status,
        verifiedAt: new Date(),
        verifiedBy,
      },
      { transaction },
    );
  }

  /**
   * Checks if all required documents are uploaded for a registration
   */
  async areAllDocumentsUploaded(registrationId: string): Promise<boolean> {
    const requiredDocumentTypes = [
      DocumentType.ACCREDITATION_CERTIFICATE,
      DocumentType.OPERATING_LICENSE,
    ];

    const uploadedDocuments = await this.registrationDocumentModel.findAll({
      where: { registrationId },
      attributes: ['documentType'],
    });

    const uploadedTypes = uploadedDocuments.map((doc) => doc.documentType);

    return requiredDocumentTypes.every((type) => uploadedTypes.includes(type));
  }

  /**
   * Automatically flags documents that require manual review based on various criteria
   * Requirements: 6.3
   */
  async flagDocumentForReview(
    documentId: string,
    flagReason: string,
    transaction?: Transaction,
  ): Promise<DocumentReviewFlag> {
    const document = await this.registrationDocumentModel.findByPk(documentId, {
      include: [{ model: this.fileUploadModel }],
      transaction,
    });

    if (!document) {
      throw new BadRequestException('Document not found');
    }

    // Update document status to require manual review
    await document.update(
      {
        verificationStatus: DocumentVerificationStatus.PENDING,
        verifiedAt: null,
        verifiedBy: null,
      },
      { transaction },
    );

    const reviewFlag: DocumentReviewFlag = {
      documentId,
      flagReason,
      flaggedAt: new Date(),
      requiresManualReview: true,
    };

    // Send notification to admins about pending review
    try {
      await this.notifyAdminsOfPendingReview(
        document.registrationId,
        reviewFlag,
      );
    } catch (error) {
      console.error(
        'Failed to notify admins of pending document review:',
        error,
      );
      // Don't fail the flagging process if notification fails
    }

    return reviewFlag;
  }

  /**
   * Performs automatic document analysis and flags suspicious documents
   * Requirements: 6.3
   */
  async performAutomaticDocumentReview(
    documentId: string,
    transaction?: Transaction,
  ): Promise<DocumentReviewFlag[]> {
    const document = await this.registrationDocumentModel.findByPk(documentId, {
      include: [{ model: this.fileUploadModel }],
      transaction,
    });

    if (!document || !document.fileUpload) {
      throw new BadRequestException('Document or file not found');
    }

    const flags: DocumentReviewFlag[] = [];

    // Flag 1: Check file size - very small files might be suspicious
    if (document.fileUpload.size && document.fileUpload.size < 50 * 1024) {
      // Less than 50KB
      const flag = await this.flagDocumentForReview(
        documentId,
        'Document file size is unusually small and may require verification',
        transaction,
      );
      flags.push(flag);
    }

    // Flag 2: Check file size - very large files might need review
    if (
      document.fileUpload.size &&
      document.fileUpload.size > 8 * 1024 * 1024
    ) {
      // Greater than 8MB
      const flag = await this.flagDocumentForReview(
        documentId,
        'Document file size is very large and may require manual review',
        transaction,
      );
      flags.push(flag);
    }

    // Flag 3: Check file name patterns that might indicate issues
    const fileName = document.fileUpload.originalName?.toLowerCase() || '';
    const suspiciousPatterns = [
      'test',
      'sample',
      'example',
      'dummy',
      'fake',
      'temp',
      'temporary',
    ];

    if (suspiciousPatterns.some((pattern) => fileName.includes(pattern))) {
      const flag = await this.flagDocumentForReview(
        documentId,
        'Document filename contains patterns that may indicate test or placeholder content',
        transaction,
      );
      flags.push(flag);
    }

    // Flag 4: Check for image files when PDF is expected for certain document types
    if (
      document.documentType === DocumentType.ACCREDITATION_CERTIFICATE &&
      document.fileUpload.mimetype !== 'application/pdf'
    ) {
      const flag = await this.flagDocumentForReview(
        documentId,
        'Accreditation certificate submitted as image file instead of PDF - may require verification',
        transaction,
      );
      flags.push(flag);
    }

    // Flag 5: Check for multiple rapid uploads of the same document type
    const recentUploads = await this.registrationDocumentModel.count({
      where: {
        registrationId: document.registrationId,
        documentType: document.documentType,
        uploadedAt: {
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      transaction,
    });

    if (recentUploads > 3) {
      const flag = await this.flagDocumentForReview(
        documentId,
        'Multiple uploads of the same document type in short timeframe - may indicate issues',
        transaction,
      );
      flags.push(flag);
    }

    return flags;
  }

  /**
   * Sends notification to admin users about documents requiring review
   * Requirements: 6.3
   */
  async notifyAdminsOfPendingReview(
    registrationId: string,
    reviewFlag: DocumentReviewFlag,
  ): Promise<void> {
    try {
      // Get registration details
      const registration = await this.registrationRecordModel.findByPk(
        registrationId,
        {
          include: [
            { model: this.registrationDocumentModel },
            // Note: Institution and User models would be included here if available
          ],
        },
      );

      if (!registration) {
        throw new BadRequestException('Registration not found');
      }

      // Get the flagged document
      const document = await this.registrationDocumentModel.findByPk(
        reviewFlag.documentId,
        {
          include: [{ model: this.fileUploadModel }],
        },
      );

      if (!document) {
        throw new BadRequestException('Flagged document not found');
      }

      // Send email to admin team (using environment variable for admin email)
      const adminEmail =
        process.env['FSMS_ADMIN_EMAIL'] || 'admin@tahiniwa.com';

      await this.emailService.send({
        from: process.env['FSMS_MAIL_FROM'] || 'noreply@tahiniwa.com',
        to: adminEmail,
        subject: 'Document Review Required - Registration System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">Document Review Required</h2>
            <p>A document has been flagged for manual review in the registration system.</p>

            <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <h3 style="margin-top: 0; color: #721c24;">Review Details</h3>
              <ul style="color: #721c24; margin: 0; padding-left: 20px;">
                <li><strong>Registration ID:</strong> ${registrationId}</li>
                <li><strong>Document ID:</strong> ${reviewFlag.documentId}</li>
                <li><strong>Document Type:</strong> ${document.documentType}</li>
                <li><strong>File Name:</strong> ${document.fileUpload?.originalName || 'Unknown'}</li>
                <li><strong>Flag Reason:</strong> ${reviewFlag.flagReason}</li>
                <li><strong>Flagged At:</strong> ${reviewFlag.flaggedAt.toISOString()}</li>
              </ul>
            </div>

            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Next Steps:</h3>
              <ol>
                <li>Log in to the admin dashboard</li>
                <li>Navigate to the registration review section</li>
                <li>Review the flagged document</li>
                <li>Approve, reject, or request resubmission as appropriate</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env['FSMS_APP_URL']}/admin/registrations/${registrationId}"
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Review Registration
              </a>
            </div>

            <p>This is an automated notification from the Tahiniwa registration system.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error(
        'Failed to send admin notification for document review:',
        error,
      );
      // Don't throw error to avoid breaking the flagging process
    }
  }

  /**
   * Updates document review status and sends notifications
   * Requirements: 6.3
   */
  async updateDocumentReviewStatus(
    documentId: string,
    status: DocumentVerificationStatus,
    reviewedBy: string,
    reviewNotes?: string,
    transaction?: Transaction,
  ): Promise<void> {
    const document = await this.registrationDocumentModel.findByPk(documentId, {
      transaction,
    });

    if (!document) {
      throw new BadRequestException('Document not found');
    }

    // Update document verification status
    await document.update(
      {
        verificationStatus: status,
        verifiedAt: new Date(),
        verifiedBy: reviewedBy,
      },
      { transaction },
    );

    // If document is rejected or requires resubmission, flag the registration for review
    if (
      status === DocumentVerificationStatus.REJECTED ||
      status === DocumentVerificationStatus.REQUIRES_RESUBMISSION
    ) {
      // Update registration status to under review
      await this.registrationRecordModel.update(
        { status: RegistrationStatus.UNDER_REVIEW },
        {
          where: { id: document.registrationId },
          transaction,
        },
      );

      // Send notification about document issues
      try {
        await this.notifyApplicantOfDocumentIssues(
          document.registrationId,
          documentId,
          status,
          reviewNotes,
        );
      } catch (error) {
        console.error('Failed to notify applicant of document issues:', error);
      }
    }
  }

  /**
   * Notifies applicant about document review issues
   * Requirements: 6.3
   */
  async notifyApplicantOfDocumentIssues(
    registrationId: string,
    documentId: string,
    status: DocumentVerificationStatus,
    reviewNotes?: string,
  ): Promise<void> {
    try {
      // This would typically fetch the registration with user details
      // For now, we'll send a generic notification to the admin email
      // In a real implementation, this would get the applicant's email from the registration

      const adminEmail =
        process.env['FSMS_ADMIN_EMAIL'] || 'admin@tahiniwa.com';
      const statusText =
        status === DocumentVerificationStatus.REJECTED
          ? 'rejected'
          : 'requires resubmission';

      await this.emailService.send({
        from: process.env['FSMS_MAIL_FROM'] || 'noreply@tahiniwa.com',
        to: adminEmail, // In real implementation, this would be the applicant's email
        subject: `Document ${statusText} - Registration ${registrationId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">Document Review Update</h2>
            <p>Your submitted document has been reviewed and ${statusText}.</p>

            <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <h3 style="margin-top: 0; color: #721c24;">Review Results</h3>
              <ul style="color: #721c24; margin: 0; padding-left: 20px;">
                <li><strong>Registration ID:</strong> ${registrationId}</li>
                <li><strong>Document ID:</strong> ${documentId}</li>
                <li><strong>Status:</strong> ${statusText}</li>
                ${reviewNotes ? `<li><strong>Review Notes:</strong> ${reviewNotes}</li>` : ''}
              </ul>
            </div>

            ${
              status === DocumentVerificationStatus.REQUIRES_RESUBMISSION
                ? `
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <h3 style="margin-top: 0; color: #856404;">Action Required</h3>
                <p style="color: #856404; margin: 0;">Please resubmit your document with the requested corrections.</p>
              </div>
            `
                : ''
            }

            <p>If you have questions about this review, please contact our support team.</p>

            <p>Best regards,<br>The Tahiniwa Team</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to notify applicant of document issues:', error);
      // Don't throw error to avoid breaking the review process
    }
  }

  /**
   * Gets all documents that require manual review
   * Requirements: 6.3
   */
  async getDocumentsRequiringReview(): Promise<RegistrationDocumentModel[]> {
    return await this.registrationDocumentModel.findAll({
      where: {
        verificationStatus: DocumentVerificationStatus.PENDING,
      },
      include: [{ model: this.fileUploadModel }],
      order: [['uploadedAt', 'ASC']], // Oldest first for review queue
    });
  }

  /**
   * Enhanced uploadRegistrationDocument method with automatic review flagging
   * Requirements: 3.1, 3.2, 6.3
   */
  async uploadRegistrationDocumentWithReview(
    file: BufferedFile,
    documentType: DocumentType,
    registrationId: string,
    transaction?: Transaction,
  ): Promise<DocumentUploadResult & { reviewFlags?: DocumentReviewFlag[] }> {
    // Upload document using existing method
    const uploadResult = await this.uploadRegistrationDocument(
      file,
      documentType,
      registrationId,
      transaction,
    );

    // Perform automatic review flagging
    let reviewFlags: DocumentReviewFlag[] = [];
    try {
      reviewFlags = await this.performAutomaticDocumentReview(
        uploadResult.documentId,
        transaction,
      );
    } catch (error) {
      console.error('Failed to perform automatic document review:', error);
      // Don't fail the upload if review flagging fails
    }

    return {
      ...uploadResult,
      reviewFlags: reviewFlags.length > 0 ? reviewFlags : undefined,
    };
  }
}
