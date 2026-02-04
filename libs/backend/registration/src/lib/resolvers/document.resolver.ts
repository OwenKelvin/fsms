import { Mutation, Resolver } from '@nestjs/graphql';
import { BadRequestException, Body, ValidationPipe } from '@nestjs/common';
import { DocumentUploadInputDto } from '../dto/document-upload-input.dto';
import { DocumentUploadResponseDto } from '../dto/document-upload-response.dto';
import {
  AppMimeType,
  BufferedFile,
  UploadedFileMetadata,
} from '@fsms/backend/file-upload';
import {
  DocumentService,
  RegistrationService,
} from '@fsms/backend/registration-backend-service';

@Resolver()
export class DocumentResolver {
  constructor(
    private readonly documentService: DocumentService,
    private readonly registrationService: RegistrationService,
  ) {}

  /**
   * Uploads a registration document with multipart form data handling
   * Requirements: 7.4
   */
  @Mutation(() => DocumentUploadResponseDto)
  async uploadRegistrationDocument(
    @Body('file') fileObject: UploadedFileMetadata,
    @Body('input', new ValidationPipe()) input: DocumentUploadInputDto,
  ): Promise<DocumentUploadResponseDto> {
    try {
      // Verify registration exists
      const registration = await this.registrationService.getRegistrationStatus(
        input.registrationId,
      );
      if (!registration) {
        return {
          success: false,
          errors: [
            {
              field: 'registrationId',
              message: 'Registration record not found',
            },
          ],
        };
      }

      // Process the uploaded file
      const file = await fileObject.file;
      const {
        createReadStream,
        filename: originalName,
        mimetype,
        encoding,
      } = file;

      // Convert stream to buffer
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        createReadStream()
          .on('data', (chunk) => chunks.push(Buffer.from(chunk)))
          .on('error', (err) => reject(err))
          .on('end', () => resolve(Buffer.concat(chunks)));
      });

      // Create BufferedFile object
      const bufferedFile: BufferedFile = {
        encoding: encoding || '',
        fieldName: 'file',
        buffer,
        size: buffer.length,
        mimetype: mimetype as AppMimeType,
        originalName: originalName || 'unknown',
      };

      // Upload document using DocumentService
      const result = await this.documentService.uploadRegistrationDocument(
        bufferedFile,
        input.documentType,
        input.registrationId,
      );

      // Check if all documents are uploaded and progress workflow if needed
      const allDocumentsUploaded =
        await this.documentService.areAllDocumentsUploaded(
          input.registrationId,
        );
      if (allDocumentsUploaded) {
        await this.registrationService.progressWorkflowState(
          input.registrationId,
          'documents',
        );
      }

      return {
        success: true,
        documentId: result.documentId,
        fileUploadId: result.fileUploadId,
        documentType: result.documentType,
        fileName: result.fileName,
        fileSize: result.fileSize,
        message: 'Document uploaded successfully',
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        return {
          success: false,
          errors: [{ field: 'general', message: error.message }],
        };
      }

      // Handle validation errors from class-validator
      if (error.response?.message && Array.isArray(error.response.message)) {
        return {
          success: false,
          errors: error.response.message.map((msg: string) => ({
            field: 'validation',
            message: msg,
          })),
        };
      }

      // Handle file processing errors
      if (error.message?.includes('File size exceeds')) {
        return {
          success: false,
          errors: [{ field: 'file', message: error.message }],
        };
      }

      if (error.message?.includes('File type must be')) {
        return {
          success: false,
          errors: [{ field: 'file', message: error.message }],
        };
      }

      return {
        success: false,
        errors: [
          {
            field: 'general',
            message: 'An unexpected error occurred during file upload',
          },
        ],
      };
    }
  }
}
