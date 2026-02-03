import { Injectable, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileUploadService, BufferedFile, UploadedFileMetadata } from '@fsms/backend/file-upload';
import { 
  RegistrationDocumentModel, 
  DocumentType, 
  DocumentVerificationStatus,
  FileUploadModel 
} from '@fsms/backend/db';
import { Transaction } from 'sequelize';

export interface DocumentUploadResult {
  documentId: number;
  fileUploadId: number;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface DocumentValidationResult {
  isValid: boolean;
  errors: string[];
}

@Injectable()
export class DocumentService {
  constructor(
    private readonly fileUploadService: FileUploadService,
    @InjectModel(RegistrationDocumentModel) 
    private readonly registrationDocumentModel: typeof RegistrationDocumentModel,
    @InjectModel(FileUploadModel) 
    private readonly fileUploadModel: typeof FileUploadModel,
  ) {}

  /**
   * Uploads a registration document with document type validation
   * Requirements: 3.1, 3.2
   */
  async uploadRegistrationDocument(
    file: BufferedFile,
    documentType: DocumentType,
    registrationId: number,
    transaction?: Transaction
  ): Promise<DocumentUploadResult> {
    // Validate document type and file
    const validation = await this.validateDocumentType(file.mimetype, documentType);
    if (!validation.isValid) {
      throw new BadRequestException(`Document validation failed: ${validation.errors.join(', ')}`);
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    try {
      // Upload file using existing FileUploadService
      const fileName = await this.fileUploadService.upload(file);

      // Create file upload record
      const fileUploadRecord = await this.fileUploadModel.create({
        name: fileName,
        encoding: file.encoding,
        size: file.size,
        mimetype: file.mimetype,
        originalName: file.originalName
      }, { transaction });

      // Link document to registration
      const registrationDocument = await this.linkDocumentToRegistration(
        fileUploadRecord.id,
        registrationId,
        documentType,
        transaction
      );

      return {
        documentId: registrationDocument.id,
        fileUploadId: fileUploadRecord.id,
        documentType,
        fileName,
        fileSize: file.size,
        uploadedAt: registrationDocument.uploadedAt
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException('Error uploading document', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Validates document type and file format
   * Requirements: 3.2, 3.4
   */
  async validateDocumentType(mimetype: string, documentType: DocumentType): Promise<DocumentValidationResult> {
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
      'image/png'
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
      errors
    };
  }

  /**
   * Links a document to a registration record
   * Requirements: 3.5
   */
  async linkDocumentToRegistration(
    fileUploadId: number,
    registrationId: number,
    documentType: DocumentType,
    transaction?: Transaction
  ): Promise<RegistrationDocumentModel> {
    // Check if document of this type already exists for this registration
    const existingDocument = await this.registrationDocumentModel.findOne({
      where: {
        registrationId,
        documentType
      },
      transaction
    });

    if (existingDocument) {
      // Update existing document with new file
      await existingDocument.update({
        fileUploadId,
        verificationStatus: DocumentVerificationStatus.PENDING,
        uploadedAt: new Date(),
        verifiedAt: null,
        verifiedBy: null
      }, { transaction });

      return existingDocument;
    } else {
      // Create new document record
      return await this.registrationDocumentModel.create({
        documentType,
        verificationStatus: DocumentVerificationStatus.PENDING,
        fileUploadId,
        registrationId,
        uploadedAt: new Date()
      }, { transaction });
    }
  }

  /**
   * Gets a secure URL for downloading a document
   */
  async getDocumentUrl(documentId: number): Promise<string> {
    const document = await this.registrationDocumentModel.findByPk(documentId, {
      include: [{ model: this.fileUploadModel }]
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
  async deleteDocument(documentId: number, transaction?: Transaction): Promise<void> {
    const document = await this.registrationDocumentModel.findByPk(documentId, {
      include: [{ model: this.fileUploadModel }],
      transaction
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
      throw new HttpException('Error deleting document', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Gets all documents for a registration
   */
  async getRegistrationDocuments(registrationId: number): Promise<RegistrationDocumentModel[]> {
    return await this.registrationDocumentModel.findAll({
      where: { registrationId },
      include: [{ model: this.fileUploadModel }],
      order: [['uploadedAt', 'DESC']]
    });
  }

  /**
   * Updates document verification status
   */
  async updateDocumentVerificationStatus(
    documentId: number,
    status: DocumentVerificationStatus,
    verifiedBy?: string,
    transaction?: Transaction
  ): Promise<void> {
    const document = await this.registrationDocumentModel.findByPk(documentId, { transaction });
    
    if (!document) {
      throw new BadRequestException('Document not found');
    }

    await document.update({
      verificationStatus: status,
      verifiedAt: new Date(),
      verifiedBy
    }, { transaction });
  }

  /**
   * Checks if all required documents are uploaded for a registration
   */
  async areAllDocumentsUploaded(registrationId: number): Promise<boolean> {
    const requiredDocumentTypes = [
      DocumentType.ACCREDITATION_CERTIFICATE,
      DocumentType.OPERATING_LICENSE
    ];

    const uploadedDocuments = await this.registrationDocumentModel.findAll({
      where: { registrationId },
      attributes: ['documentType']
    });

    const uploadedTypes = uploadedDocuments.map(doc => doc.documentType);
    
    return requiredDocumentTypes.every(type => uploadedTypes.includes(type));
  }
}