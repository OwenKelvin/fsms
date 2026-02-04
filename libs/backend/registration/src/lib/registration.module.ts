import { Module, Logger } from '@nestjs/common';
import { RegistrationResolver } from './resolvers/registration.resolver';
import { DocumentResolver } from './resolvers/document.resolver';
import { RegistrationQueryResolver } from './resolvers/registration-query.resolver';
import { RegistrationServiceModule } from '@fsms/backend/registration-backend-service';

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
    RegistrationServiceModule
  ],
  providers: [
    RegistrationResolver,      // Registration mutations
    DocumentResolver,          // Document upload mutations
    RegistrationQueryResolver, // Registration queries

    // Logger for error handling and debugging
    {
      provide: Logger,
      useValue: new Logger('RegistrationServiceModule'),
    },
  ],
})
export class RegistrationModule {
  private readonly logger = new Logger(RegistrationModule.name);

  constructor() {
    this.logger.log('RegistrationServiceModule initialized successfully');
    this.logger.log('Services: RegistrationService, DocumentService');
    this.logger.log('Resolvers: RegistrationResolver, DocumentResolver, RegistrationQueryResolver');
  }
}
