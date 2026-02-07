import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  InstitutionModel,
  InstitutionType,
  JobTitleModel,
  RegistrationRecordModel,
  RegistrationStatus,
  RegistrationStatusHistoryModel,
  RoleModel,
  UserModel,
} from '@fsms/backend/db';
import { Op, Transaction } from 'sequelize';
import { hash } from 'bcrypt';
import { Sequelize } from 'sequelize-typescript';
import { EmailService } from '@fsms/backend/email-service';
import { AuthServiceBackend } from '@fsms/backend/auth-service';

export interface ProfileInfoInput {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
}

export interface InstitutionDetailsInput {
  legalName: string;
  institutionType: InstitutionType;
  accreditationNumber: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  zipPostalCode: string;
  officialWebsite?: string;
}

export interface AdminCredentialsInput {
  username: string;
  password: string;
  passwordConfirmation: string;
  enableTwoFactor?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface RegistrationResult {
  success: boolean;
  institutionId?: string;
  adminUserId?: string;
  twoFactorSetup?: {
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
  };
  errors?: ValidationError[];
}

export interface CompleteRegistrationData {
  profileInfo: ProfileInfoInput;
  institutionDetails: InstitutionDetailsInput;
  adminCredentials: AdminCredentialsInput;
}

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);
  private readonly saltOrRounds = 10;

  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    @InjectModel(InstitutionModel)
    private readonly institutionModel: typeof InstitutionModel,
    @InjectModel(JobTitleModel)
    private readonly jobTitleModel: typeof JobTitleModel,
    @InjectModel(RegistrationRecordModel)
    private readonly registrationRecordModel: typeof RegistrationRecordModel,
    @InjectModel(RegistrationStatusHistoryModel)
    private readonly registrationStatusHistoryModel: typeof RegistrationStatusHistoryModel,
    @InjectModel(RoleModel) private readonly roleModel: typeof RoleModel,
    private readonly sequelize: Sequelize,
    private readonly emailService: EmailService,
    private readonly authService: AuthServiceBackend,
  ) {
    this.logger.log('RegistrationService initialized');
  }

  /**
   * Validates profile information business rules (email uniqueness)
   * Requirements: 1.1, 1.2, 1.3
   *
   * Note: Basic validation (required fields, format, length) is handled by DTO validators
   */
  async validateProfileInfo(
    input: ProfileInfoInput,
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Check email uniqueness (business rule validation)
    if (input.email) {
      const existingUser = await this.userModel.findOne({
        where: { email: input.email },
      });
      if (existingUser) {
        errors.push({
          field: 'email',
          message: 'Email address is already registered',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Finds existing job title or creates a new one
   * Requirements: 1.4
   */
  async findOrCreateJobTitle(title: string): Promise<JobTitleModel> {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      throw new BadRequestException('Job title cannot be empty');
    }

    // Try to find existing job title (case-insensitive)
    let jobTitle = await this.jobTitleModel.findOne({
      where: {
        title: {
          [Op.iLike]: trimmedTitle,
        },
        isActive: true,
      },
    });

    // Create new job title if not found
    if (!jobTitle) {
      jobTitle = await this.jobTitleModel.create({
        title: trimmedTitle,
        isActive: true,
      });
    }

    return jobTitle;
  }

  /**
   * Validates institution details business rules
   * Requirements: 2.1, 2.2, 2.3
   *
   * Note: Basic validation (required fields, format, length) is handled by DTO validators
   * This method can be extended to add business-specific validation like checking
   * accreditation number uniqueness, verifying institution type eligibility, etc.
   */
  async validateInstitutionDetails(
    input: InstitutionDetailsInput,
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Add business rule validations here if needed
    // For example: check if accreditation number is already registered
    // const existingInstitution = await this.institutionModel.findOne({
    //   where: { accreditationNumber: input.accreditationNumber },
    // });
    // if (existingInstitution) {
    //   errors.push({
    //     field: 'accreditationNumber',
    //     message: 'Accreditation number is already registered',
    //   });
    // }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates admin credentials business rules (username uniqueness, password strength, password match)
   * Requirements: 4.1, 4.2, 4.3
   *
   * Note: Basic validation (required fields, min length) is handled by DTO validators
   */
  async validateAdminCredentials(
    input: AdminCredentialsInput,
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Check username uniqueness (business rule)
    if (input.username) {
      const existingUser = await this.userModel.findOne({
        where: { username: input.username },
      });
      if (existingUser) {
        errors.push({
          field: 'username',
          message: 'Username is already taken',
        });
      }
    }

    // Validate password strength (business rule)
    if (input.password) {
      const passwordErrors = this.validatePasswordStrength(input.password);
      errors.push(...passwordErrors);
    }

    // Validate password confirmation match (business rule)
    if (input.password && input.passwordConfirmation) {
      if (input.password !== input.passwordConfirmation) {
        errors.push({
          field: 'passwordConfirmation',
          message: 'Password confirmation does not match',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates password strength according to requirements
   * Requirements: 4.2
   *
   * Note: Minimum length validation is handled by DTO validators
   */
  private validatePasswordStrength(password: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!/[a-z]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one lowercase letter',
      });
    }

    if (!/[A-Z]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one uppercase letter',
      });
    }

    if (!/\d/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one number',
      });
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push({
        field: 'password',
        message: 'Password must contain at least one special character',
      });
    }

    return errors;
  }

  /**
   * Updates registration status and creates audit trail
   * Requirements: 1.5, 2.5, 4.5
   */
  async updateRegistrationStatus(
    registrationId: string,
    newStatus: RegistrationStatus,
    changedBy?: string,
    notes?: string,
    transaction?: Transaction,
  ): Promise<void> {
    const registration = await this.registrationRecordModel.findByPk(
      registrationId,
      { transaction },
    );

    if (!registration) {
      throw new BadRequestException('Registration record not found');
    }

    const previousStatus = registration.status;

    // Update registration status
    await registration.update({ status: newStatus }, { transaction });

    // Create status history entry
    await this.registrationStatusHistoryModel.create(
      {
        registrationId,
        previousStatus,
        newStatus,
        changedAt: new Date(),
        changedBy,
        notes,
      },
      { transaction },
    );
  }

  /**
   * Advances registration workflow to next step based on current status
   * Requirements: 1.5, 2.5, 4.5
   */
  async progressWorkflowState(
    registrationId: string,
    completedStep:
      | 'profileInfo'
      | 'institutionDetails'
      | 'documents'
      | 'adminCredentials',
    transaction?: Transaction,
  ): Promise<void> {
    const registration = await this.registrationRecordModel.findByPk(
      registrationId,
      { transaction },
    );

    if (!registration) {
      throw new BadRequestException('Registration record not found');
    }

    let newStatus: RegistrationStatus;
    const updateData: Partial<RegistrationRecordModel> = {};

    switch (completedStep) {
      case 'profileInfo':
        updateData.profileInfoCompleted = true;
        newStatus = RegistrationStatus.PROFILE_INFO_COLLECTED;
        break;
      case 'institutionDetails':
        updateData.institutionDetailsCompleted = true;
        newStatus = RegistrationStatus.INSTITUTION_DETAILS_COLLECTED;
        break;
      case 'documents':
        updateData.documentsUploaded = true;
        newStatus = RegistrationStatus.DOCUMENTS_UPLOADED;
        break;
      case 'adminCredentials':
        updateData.adminCredentialsCompleted = true;
        newStatus = RegistrationStatus.ADMIN_CREDENTIALS_SET;
        break;
      default:
        throw new BadRequestException('Invalid workflow step');
    }

    // Update registration record
    await registration.update(updateData, { transaction });

    // Update status
    await this.updateRegistrationStatus(
      registrationId,
      newStatus,
      'system',
      `Completed ${completedStep} step`,
      transaction,
    );
  }

  /**
   * Creates a new registration record
   */
  async createRegistrationRecord(): Promise<RegistrationRecordModel> {

    return await this.registrationRecordModel.create({
      status: RegistrationStatus.PENDING,
      profileInfoCompleted: false,
      institutionDetailsCompleted: false,
      documentsUploaded: false,
      adminCredentialsCompleted: false,
    });
  }

  /**
   * Gets registration status by ID
   */
  async getRegistrationStatus(
    registrationId: string,
  ): Promise<RegistrationRecordModel | null> {
    return await this.registrationRecordModel.findByPk(registrationId, {
      include: [
        { model: this.institutionModel },
        { model: this.userModel },
        { model: this.registrationStatusHistoryModel },
      ],
    });
  }

  /**
   * Query registrations by status
   * Requirements: 6.4
   */
  async getRegistrationsByStatus(
    status: RegistrationStatus,
  ): Promise<RegistrationRecordModel[]> {
    return await this.registrationRecordModel.findAll({
      where: { status },
      include: [
        { model: this.institutionModel },
        { model: this.userModel },
        { model: this.registrationStatusHistoryModel },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Query registrations by date range
   * Requirements: 6.4
   */
  async getRegistrationsByDateRange(
    startDate: Date,
    endDate: Date,
    status?: RegistrationStatus,
  ): Promise<RegistrationRecordModel[]> {
    const whereClause: any = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (status) {
      whereClause.status = status;
    }

    return await this.registrationRecordModel.findAll({
      where: whereClause,
      include: [
        { model: this.institutionModel },
        { model: this.userModel },
        { model: this.registrationStatusHistoryModel },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Query registrations with multiple status filters
   * Requirements: 6.4
   */
  async getRegistrationsByStatuses(
    statuses: RegistrationStatus[],
  ): Promise<RegistrationRecordModel[]> {
    return await this.registrationRecordModel.findAll({
      where: {
        status: {
          [Op.in]: statuses,
        },
      },
      include: [
        { model: this.institutionModel },
        { model: this.userModel },
        { model: this.registrationStatusHistoryModel },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Get registration status history for a specific registration
   * Requirements: 6.1, 6.2
   */
  async getRegistrationStatusHistory(
    registrationId: string,
  ): Promise<RegistrationStatusHistoryModel[]> {
    return await this.registrationStatusHistoryModel.findAll({
      where: { registrationId },
      order: [['changedAt', 'ASC']],
    });
  }

  /**
   * Get registrations that require manual review
   * Requirements: 6.3
   */
  async getRegistrationsRequiringReview(): Promise<RegistrationRecordModel[]> {
    return await this.registrationRecordModel.findAll({
      where: {
        status: {
          [Op.in]: [
            RegistrationStatus.UNDER_REVIEW,
            RegistrationStatus.DOCUMENTS_UPLOADED,
          ],
        },
      },
      include: [
        { model: this.institutionModel },
        { model: this.userModel },
        { model: this.registrationStatusHistoryModel },
      ],
      order: [['createdAt', 'ASC']], // Oldest first for review queue
    });
  }

  /**
   * Enhanced updateRegistrationStatus method with better audit trail
   * Requirements: 6.1, 6.2
   */
  async updateRegistrationStatusWithAudit(
    registrationId: string,
    newStatus: RegistrationStatus,
    changedBy: string,
    notes?: string,
    transaction?: Transaction,
  ): Promise<RegistrationStatusHistoryModel> {
    const registration = await this.registrationRecordModel.findByPk(
      registrationId,
      { transaction },
    );

    if (!registration) {
      throw new BadRequestException('Registration record not found');
    }

    const previousStatus = registration.status;

    // Update registration status
    await registration.update({ status: newStatus }, { transaction });

    // Create detailed status history entry
    const historyEntry = await this.registrationStatusHistoryModel.create(
      {
        registrationId,
        previousStatus,
        newStatus,
        changedAt: new Date(),
        changedBy,
        notes: notes || `Status changed from ${previousStatus} to ${newStatus}`,
      },
      { transaction },
    );

    return historyEntry;
  }

  /**
   * Hash password for storage
   */
  async hashPassword(password: string): Promise<string> {
    return await hash(password, this.saltOrRounds);
  }

  /**
   * Completes the registration process atomically
   * Creates institution and admin user records with proper relationships
   * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
   */
  async completeRegistration(
    registrationId: string,
    registrationData: CompleteRegistrationData,
  ): Promise<RegistrationResult> {
    this.logger.log(
      `Starting registration completion for registration ID: ${registrationId}`,
    );
    const transaction = await this.sequelize.transaction();

    try {
      // Verify registration exists and is ready for completion
      const registration = await this.registrationRecordModel.findByPk(
        registrationId,
        {
          transaction,
        },
      );

      if (!registration) {
        this.logger.warn(`Registration not found: ${registrationId}`);
        throw new BadRequestException('Registration record not found');
      }

      // Verify all steps are completed
      if (
        !registration.profileInfoCompleted ||
        !registration.institutionDetailsCompleted ||
        !registration.documentsUploaded ||
        !registration.adminCredentialsCompleted
      ) {
        this.logger.warn(
          `Registration ${registrationId} is not ready for completion`,
        );
        throw new BadRequestException(
          'Registration is not ready for completion. All steps must be completed first.',
        );
      }

      // Verify current status allows completion
      if (registration.status !== RegistrationStatus.ADMIN_CREDENTIALS_SET) {
        this.logger.warn(
          `Registration ${registrationId} has invalid status: ${registration.status}`,
        );
        throw new BadRequestException(
          `Registration cannot be completed from status: ${registration.status}`,
        );
      }

      // Find or create job title
      const jobTitle = await this.findOrCreateJobTitle(
        registrationData.profileInfo.jobTitle,
      );
      this.logger.debug(
        `Job title resolved: ${jobTitle.title} (ID: ${jobTitle.id})`,
      );

      // Hash the admin password
      const hashedPassword = await this.hashPassword(
        registrationData.adminCredentials.password,
      );

      // Create institution record
      const institution = await this.institutionModel.create(
        {
          name: registrationData.institutionDetails.legalName, // For backward compatibility
          legalName: registrationData.institutionDetails.legalName,
          institutionType: registrationData.institutionDetails.institutionType,
          accreditationNumber:
            registrationData.institutionDetails.accreditationNumber,
          streetAddress: registrationData.institutionDetails.streetAddress,
          city: registrationData.institutionDetails.city,
          stateProvince: registrationData.institutionDetails.stateProvince,
          zipPostalCode: registrationData.institutionDetails.zipPostalCode,
          officialWebsite: registrationData.institutionDetails.officialWebsite,
          createdById: null, // Will be updated after user creation
        },
        { transaction },
      );
      this.logger.log(
        `Institution created: ${institution.legalName} (ID: ${institution.id})`,
      );

      // Create admin user record
      const adminUser = await this.userModel.create(
        {
          firstName: registrationData.profileInfo.firstName,
          lastName: registrationData.profileInfo.lastName,
          email: registrationData.profileInfo.email,
          username: registrationData.adminCredentials.username,
          password: hashedPassword,
          jobTitleId: jobTitle.id,
          emailVerifiedAt: null, // Will be verified separately
          phoneVerifiedAt: null,
        },
        { transaction },
      );
      this.logger.log(
        `Admin user created: ${adminUser.username} (ID: ${adminUser.id})`,
      );

      // Update institution with the created user as creator
      await institution.update(
        {
          createdById: adminUser.id,
        },
        { transaction },
      );

      // Assign admin role to the user
      await this.assignAdminRole(adminUser.id, transaction);
      this.logger.debug(`Admin role assigned to user ${adminUser.id}`);

      // Update registration record with final relationships
      await registration.update(
        {
          institutionId: institution.id,
          adminUserId: adminUser.id,
          completedAt: new Date(),
        },
        { transaction },
      );

      // Update registration status to under review
      await this.updateRegistrationStatus(
        registrationId,
        RegistrationStatus.UNDER_REVIEW,
        'system',
        'Registration completed successfully, pending review',
        transaction,
      );

      // Commit the transaction
      await transaction.commit();
      this.logger.log(
        `Registration ${registrationId} completed successfully. Institution ID: ${institution.id}, User ID: ${adminUser.id}`,
      );

      // Setup two-factor authentication if requested
      let twoFactorSetup;
      if (registrationData.adminCredentials.enableTwoFactor) {
        try {
          twoFactorSetup = await this.authService.setupTwoFactorAuth(
            adminUser.id,
          );
          this.logger.log(
            `Two-factor authentication setup for user ${adminUser.id}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to setup two-factor authentication for user ${adminUser.id}:`,
            error,
          );
          // Don't fail the registration if 2FA setup fails
        }
      }

      return {
        success: true,
        institutionId: institution.id,
        adminUserId: adminUser.id,
        twoFactorSetup,
      };
    } catch (error: any) {
      // Rollback transaction on any error
      await transaction.rollback();
      this.logger.error(
        `Registration ${registrationId} failed and was rolled back:`,
        error,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle specific database constraint errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors?.[0]?.path;
        const message =
          field === 'email'
            ? 'Email address is already registered'
            : field === 'username'
              ? 'Username is already taken'
              : 'A unique constraint was violated';

        this.logger.warn(
          `Unique constraint violation during registration ${registrationId}: ${field}`,
        );
        return {
          success: false,
          errors: [{ field: field || 'unknown', message }],
        };
      }

      // Handle other database errors
      if (error.name?.startsWith('Sequelize')) {
        this.logger.error(
          `Database error during registration ${registrationId}:`,
          error,
        );
        return {
          success: false,
          errors: [{ field: 'database', message: 'Database operation failed' }],
        };
      }

      // Re-throw unexpected errors
      throw error;
    }
  }

  /**
   * Assigns admin role to a user
   * Requirements: 5.4
   */
  private async assignAdminRole(
    userId: string,
    transaction: Transaction,
  ): Promise<void> {
    // Find the admin role (assuming it exists)
    const adminRole = await this.roleModel.findOne({
      where: { name: 'admin' },
      transaction,
    });

    if (!adminRole) {
      // If admin role doesn't exist, create it
      const newAdminRole = await this.roleModel.create(
        {
          name: 'admin',
        },
        { transaction },
      );

      // Associate user with the new admin role
      await this.userModel
        .findByPk(userId, { transaction })
        .then((user) => user?.$add('roles', newAdminRole, { transaction }));
    } else {
      // Associate user with existing admin role
      await this.userModel
        .findByPk(userId, { transaction })
        .then((user) => user?.$add('roles', adminRole, { transaction }));
    }
  }

  /**
   * Sends registration completion notification email
   * Requirements: 6.5
   */
  async sendRegistrationCompletionNotification(
    registrationId: string,
  ): Promise<void> {
    const registration = await this.registrationRecordModel.findByPk(
      registrationId,
      {
        include: [{ model: this.institutionModel }, { model: this.userModel }],
      },
    );

    if (!registration || !registration.adminUser || !registration.institution) {
      throw new BadRequestException(
        'Registration record, user, or institution not found',
      );
    }

    const { adminUser, institution } = registration;

    if (!adminUser.email) {
      throw new BadRequestException('Admin user email not found');
    }

    try {
      await this.emailService.send({
        from: process.env['FSMS_MAIL_FROM'] || 'noreply@tahiniwa.com',
        to: adminUser.email,
        subject: 'Registration Completed - Under Review',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Registration Completed Successfully</h2>
            <p>Dear ${adminUser.firstName} ${adminUser.lastName},</p>
            <p>Thank you for completing your institution registration with Tahiniwa. Your registration for <strong>${institution.legalName}</strong> has been successfully submitted and is now under review.</p>

            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Registration Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Institution:</strong> ${institution.legalName}</li>
                <li><strong>Type:</strong> ${institution.institutionType}</li>
                <li><strong>Registration ID:</strong> ${registrationId}</li>
                <li><strong>Status:</strong> Under Review</li>
              </ul>
            </div>

            <p>Our team will review your registration and supporting documents. You will receive an email notification once the review is complete.</p>

            <p>If you have any questions, please don't hesitate to contact our support team.</p>

            <p>Best regards,<br>The Tahiniwa Team</p>
          </div>
        `,
      });
    } catch (error) {
      console.error(
        'Failed to send registration completion notification:',
        error,
      );
      // Don't throw error to avoid breaking the registration flow
    }
  }

  /**
   * Sends registration approval notification email
   * Requirements: 6.5
   */
  async sendRegistrationApprovalNotification(
    registrationId: string,
  ): Promise<void> {
    const registration = await this.registrationRecordModel.findByPk(
      registrationId,
      {
        include: [{ model: this.institutionModel }, { model: this.userModel }],
      },
    );

    if (!registration || !registration.adminUser || !registration.institution) {
      throw new BadRequestException(
        'Registration record, user, or institution not found',
      );
    }

    const { adminUser, institution } = registration;

    if (!adminUser.email) {
      throw new BadRequestException('Admin user email not found');
    }

    try {
      await this.emailService.send({
        from: process.env['FSMS_MAIL_FROM'] || 'noreply@tahiniwa.com',
        to: adminUser.email,
        subject: 'Registration Approved - Welcome to Tahiniwa!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Registration Approved!</h2>
            <p>Dear ${adminUser.firstName} ${adminUser.lastName},</p>
            <p>Congratulations! Your institution registration for <strong>${institution.legalName}</strong> has been approved.</p>

            <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0; color: #155724;">Your account is now active!</h3>
              <p style="margin-bottom: 0; color: #155724;">You can now log in to your admin dashboard and start using Tahiniwa's services.</p>
            </div>

            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Next Steps:</h3>
              <ol>
                <li>Log in to your admin dashboard using your credentials</li>
                <li>Complete your institution profile setup</li>
                <li>Invite additional users to your institution</li>
                <li>Explore available features and services</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env['FSMS_APP_URL']}/login"
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Access Your Dashboard
              </a>
            </div>

            <p>If you need any assistance getting started, our support team is here to help.</p>

            <p>Welcome to Tahiniwa!<br>The Tahiniwa Team</p>
          </div>
        `,
      });
    } catch (error) {
      console.error(
        'Failed to send registration approval notification:',
        error,
      );
      // Don't throw error to avoid breaking the approval flow
    }
  }

  /**
   * Sends registration rejection notification email
   * Requirements: 6.5
   */
  async sendRegistrationRejectionNotification(
    registrationId: string,
    rejectionReason?: string,
  ): Promise<void> {
    const registration = await this.registrationRecordModel.findByPk(
      registrationId,
      {
        include: [{ model: this.institutionModel }, { model: this.userModel }],
      },
    );

    if (!registration || !registration.adminUser || !registration.institution) {
      throw new BadRequestException(
        'Registration record, user, or institution not found',
      );
    }

    const { adminUser, institution } = registration;

    if (!adminUser.email) {
      throw new BadRequestException('Admin user email not found');
    }

    try {
      await this.emailService.send({
        from: process.env['FSMS_MAIL_FROM'] || 'noreply@tahiniwa.com',
        to: adminUser.email,
        subject: 'Registration Update Required',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">Registration Requires Updates</h2>
            <p>Dear ${adminUser.firstName} ${adminUser.lastName},</p>
            <p>Thank you for your interest in registering <strong>${institution.legalName}</strong> with Tahiniwa.</p>

            <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <h3 style="margin-top: 0; color: #721c24;">Additional Information Required</h3>
              <p style="color: #721c24;">
                After reviewing your registration, we need some additional information or documentation before we can proceed.
              </p>
              ${
                rejectionReason
                  ? `
                <div style="background-color: white; padding: 10px; border-radius: 3px; margin-top: 10px;">
                  <strong>Details:</strong><br>
                  ${rejectionReason}
                </div>
              `
                  : ''
              }
            </div>

            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">What to do next:</h3>
              <ol>
                <li>Review the feedback provided above</li>
                <li>Gather any additional required documentation</li>
                <li>Contact our support team if you have questions</li>
                <li>Resubmit your registration when ready</li>
              </ol>
            </div>

            <p>Our support team is available to help you through this process. Please don't hesitate to reach out if you need assistance.</p>

            <p>Thank you for your patience.<br>The Tahiniwa Team</p>
          </div>
        `,
      });
    } catch (error) {
      console.error(
        'Failed to send registration rejection notification:',
        error,
      );
      // Don't throw error to avoid breaking the rejection flow
    }
  }

  /**
   * Enhanced completeRegistration method with email notification
   * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.5
   */
  async completeRegistrationWithNotification(
    registrationId: string,
    registrationData: CompleteRegistrationData,
  ): Promise<RegistrationResult> {
    // Complete the registration using existing method
    const result = await this.completeRegistration(
      registrationId,
      registrationData,
    );

    // Send completion notification if successful
    if (result.success) {
      try {
        await this.sendRegistrationCompletionNotification(registrationId);
      } catch (error) {
        console.error(
          'Failed to send completion notification, but registration was successful:',
          error,
        );
        // Don't fail the registration if email fails
      }
    }

    return result;
  }

  /**
   * Enhanced updateRegistrationStatusWithAudit method with email notifications
   * Requirements: 6.1, 6.2, 6.5
   */
  async updateRegistrationStatusWithNotification(
    registrationId: string,
    newStatus: RegistrationStatus,
    changedBy: string,
    notes?: string,
    transaction?: Transaction,
  ): Promise<RegistrationStatusHistoryModel> {
    // Update status using existing method
    const historyEntry = await this.updateRegistrationStatusWithAudit(
      registrationId,
      newStatus,
      changedBy,
      notes,
      transaction,
    );

    // Send appropriate notification based on status
    if (newStatus === RegistrationStatus.APPROVED) {
      try {
        await this.sendRegistrationApprovalNotification(registrationId);
      } catch (error) {
        console.error('Failed to send approval notification:', error);
      }
    } else if (newStatus === RegistrationStatus.REJECTED) {
      try {
        await this.sendRegistrationRejectionNotification(registrationId, notes);
      } catch (error) {
        console.error('Failed to send rejection notification:', error);
      }
    }

    return historyEntry;
  }

  /**
   * Approves a registration application
   * Requirements: 3.1, 3.2, 3.3, 3.4, 6.5
   */
  async approveRegistration(
    registrationId: string,
    adminUserId: string,
    notes?: string,
  ): Promise<RegistrationRecordModel> {
    this.logger.log(
      `Starting approval process for registration ID: ${registrationId} by admin: ${adminUserId}`,
    );

    const transaction = await this.sequelize.transaction();

    try {
      // 1. Fetch registration and validate status is UNDER_REVIEW
      const registration = await this.registrationRecordModel.findByPk(
        registrationId,
        {
          include: [{ model: this.institutionModel }],
          transaction,
        },
      );

      if (!registration) {
        this.logger.warn(`Registration not found: ${registrationId}`);
        throw new BadRequestException('Registration record not found');
      }

      if (registration.status !== RegistrationStatus.UNDER_REVIEW) {
        this.logger.warn(
          `Registration ${registrationId} has invalid status for approval: ${registration.status}`,
        );
        throw new BadRequestException(
          `Registration cannot be approved from status: ${registration.status}. Only registrations with UNDER_REVIEW status can be approved.`,
        );
      }

      // 2. Validate associated institution exists
      if (!registration.institution) {
        this.logger.warn(
          `Associated institution not found for registration: ${registrationId}`,
        );
        throw new BadRequestException('Associated institution not found');
      }

      // 3. Capture previous status before updating
      const previousStatus = registration.status;

      // 4. Update registration status to APPROVED
      await registration.update(
        { status: RegistrationStatus.APPROVED },
        { transaction },
      );
      this.logger.debug(
        `Registration ${registrationId} status updated to APPROVED`,
      );

      // 5. Activate associated institution (Note: active field doesn't exist yet in model)
      // TODO: Add active field to InstitutionModel and migration
      // For now, we'll skip this step as the field doesn't exist
      // await registration.institution.update({ active: true }, { transaction });

      // 6. Create status history record with admin info and optional notes
      await this.createStatusHistoryRecord(
        registrationId,
        previousStatus,
        RegistrationStatus.APPROVED,
        adminUserId,
        notes || 'Registration approved',
        transaction,
      );
      this.logger.debug(
        `Status history record created for registration ${registrationId}`,
      );

      // 6. Commit transaction
      await transaction.commit();
      this.logger.log(
        `Registration ${registrationId} approved successfully by admin ${adminUserId}`,
      );

      // 7. Send approval notification (outside transaction)
      try {
        await this.sendRegistrationApprovalNotification(registrationId);
      } catch (error) {
        this.logger.error(
          `Failed to send approval notification for registration ${registrationId}:`,
          error,
        );
        // Don't fail the approval if email fails
      }

      // 8. Return updated registration
      return await this.registrationRecordModel.findByPk(registrationId, {
        include: [
          { model: this.institutionModel },
          { model: this.userModel },
          { model: this.registrationStatusHistoryModel },
        ],
      }) as RegistrationRecordModel;
    } catch (error: any) {
      // Rollback transaction on any error
      await transaction.rollback();
      this.logger.error(
        `Registration approval ${registrationId} failed and was rolled back:`,
        error,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle unexpected errors
      throw new BadRequestException(
        'Failed to approve registration. Please try again.',
      );
    }
  }

  /**
   * Rejects a registration application
   * Requirements: 4.1, 4.2, 4.3, 6.5
   */
  async rejectRegistration(
    registrationId: string,
    adminUserId: string,
    reason: string,
  ): Promise<RegistrationRecordModel> {
    this.logger.log(
      `Starting rejection process for registration ID: ${registrationId} by admin: ${adminUserId}`,
    );

    // 1. Validate reason is provided (non-empty)
    if (!reason || reason.trim().length === 0) {
      this.logger.warn(
        `Rejection attempted without reason for registration: ${registrationId}`,
      );
      throw new BadRequestException('Rejection reason is required');
    }

    const transaction = await this.sequelize.transaction();

    try {
      // 2. Fetch registration and validate status is UNDER_REVIEW
      const registration = await this.registrationRecordModel.findByPk(
        registrationId,
        {
          transaction,
        },
      );

      if (!registration) {
        this.logger.warn(`Registration not found: ${registrationId}`);
        throw new BadRequestException('Registration record not found');
      }

      if (registration.status !== RegistrationStatus.UNDER_REVIEW) {
        this.logger.warn(
          `Registration ${registrationId} has invalid status for rejection: ${registration.status}`,
        );
        throw new BadRequestException(
          `Registration cannot be rejected from status: ${registration.status}. Only registrations with UNDER_REVIEW status can be rejected.`,
        );
      }

      // 3. Capture previous status before updating
      const previousStatus = registration.status;

      // 4. Update registration status to REJECTED
      await registration.update(
        { status: RegistrationStatus.REJECTED },
        { transaction },
      );
      this.logger.debug(
        `Registration ${registrationId} status updated to REJECTED`,
      );

      // 5. Create status history record with admin info and rejection reason
      await this.createStatusHistoryRecord(
        registrationId,
        previousStatus,
        RegistrationStatus.REJECTED,
        adminUserId,
        reason,
        transaction,
      );
      this.logger.debug(
        `Status history record created for registration ${registrationId}`,
      );

      // 5. Commit transaction
      await transaction.commit();
      this.logger.log(
        `Registration ${registrationId} rejected successfully by admin ${adminUserId}`,
      );

      // 6. Send rejection notification (outside transaction)
      try {
        await this.sendRegistrationRejectionNotification(
          registrationId,
          reason,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send rejection notification for registration ${registrationId}:`,
          error,
        );
        // Don't fail the rejection if email fails
      }

      // 7. Return updated registration
      return await this.registrationRecordModel.findByPk(registrationId, {
        include: [
          { model: this.institutionModel },
          { model: this.userModel },
          { model: this.registrationStatusHistoryModel },
        ],
      }) as RegistrationRecordModel;
    } catch (error: any) {
      // Rollback transaction on any error
      await transaction.rollback();
      this.logger.error(
        `Registration rejection ${registrationId} failed and was rolled back:`,
        error,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle unexpected errors
      throw new BadRequestException(
        'Failed to reject registration. Please try again.',
      );
    }
  }

  /**
   * Creates a status history record
   * Requirements: 7.1, 7.2
   * 
   * This helper method creates an immutable status history record with timestamp.
   * It accepts registrationId, status, adminUserId, and optional notes.
   * 
   * @param registrationId - The ID of the registration
   * @param previousStatus - The previous status before the change
   * @param newStatus - The new status after the change
   * @param adminUserId - The ID of the admin user making the change
   * @param notes - Optional notes or reason for the status change
   * @param transaction - Optional database transaction
   */
  private async createStatusHistoryRecord(
    registrationId: string,
    previousStatus: RegistrationStatus | null,
    newStatus: RegistrationStatus,
    adminUserId: string,
    notes?: string,
    transaction?: Transaction,
  ): Promise<void> {
    await this.registrationStatusHistoryModel.create(
      {
        registrationId,
        previousStatus,
        newStatus,
        changedAt: new Date(),
        changedBy: adminUserId,
        notes: notes || `Status changed from ${previousStatus || 'none'} to ${newStatus}`,
      },
      { transaction },
    );
  }
}
