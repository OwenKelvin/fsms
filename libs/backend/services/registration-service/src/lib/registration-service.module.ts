import { Module, Logger } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  UserModel,
  InstitutionModel,
  JobTitleModel,
  RegistrationRecordModel,
  RegistrationStatusHistoryModel,
  RegistrationDocumentModel,
  FileUploadModel,
  RoleModel
} from '@fsms/backend/db';
import { FileUploadModule } from '@fsms/backend/file-upload';
import { EmailModule } from '@fsms/backend/email-service';
import { AuthServiceBackendModule } from '@fsms/backend/auth-service';
import { RegistrationService } from './services/registration.service';
import { DocumentService } from './services/document.service';

/**
 * RegistrationServiceModule
 *
 * Provides comprehensive institution registration functionality including:
 * - Multi-step registration workflow (profile, institution details, documents, credentials)
 * - Document upload and verification with automatic review flagging
 * - Email notifications for registration status changes
 * - GraphQL API integration for frontend consumption
 * - Atomic registration completion with proper relationship establishment
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 *
 * @module RegistrationServiceModule
 */
@Module({
  imports: [
    // Database models for registration workflow
    SequelizeModule.forFeature([
      UserModel,
      InstitutionModel,
      JobTitleModel,
      RegistrationRecordModel,
      RegistrationStatusHistoryModel,
      RegistrationDocumentModel,
      FileUploadModel,
      RoleModel
    ]),
    // External service dependencies
    FileUploadModule,      // For document upload to MinIO
    EmailModule,           // For notification emails
    AuthServiceBackendModule  // For two-factor authentication setup
  ],
  providers: [
    // Core services
    RegistrationService,   // Main registration workflow orchestration
    DocumentService,       // Document upload and review management

    // Logger for error handling and debugging
    {
      provide: Logger,
      useValue: new Logger('RegistrationServiceModule'),
    },
  ],
  exports: [
    RegistrationService,
    DocumentService
  ],
})
export class RegistrationServiceModule {
  private readonly logger = new Logger(RegistrationServiceModule.name);

  constructor() {
    this.logger.log('RegistrationServiceModule initialized successfully');
    this.logger.log('Services: RegistrationService, DocumentService');
    this.logger.log('Resolvers: RegistrationResolver, DocumentResolver, RegistrationQueryResolver');
  }
}
