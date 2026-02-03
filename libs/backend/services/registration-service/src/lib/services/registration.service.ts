import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { 
  UserModel, 
  InstitutionModel, 
  JobTitleModel, 
  RegistrationRecordModel, 
  RegistrationStatus,
  RegistrationStatusHistoryModel,
  InstitutionType 
} from '@fsms/backend/db';
import { Op, Transaction } from 'sequelize';
import { hash } from 'bcrypt';

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

@Injectable()
export class RegistrationService {
  private readonly saltOrRounds = 10;

  constructor(
    @InjectModel(UserModel) private readonly userModel: typeof UserModel,
    @InjectModel(InstitutionModel) private readonly institutionModel: typeof InstitutionModel,
    @InjectModel(JobTitleModel) private readonly jobTitleModel: typeof JobTitleModel,
    @InjectModel(RegistrationRecordModel) private readonly registrationRecordModel: typeof RegistrationRecordModel,
    @InjectModel(RegistrationStatusHistoryModel) private readonly registrationStatusHistoryModel: typeof RegistrationStatusHistoryModel,
  ) {}

  /**
   * Validates profile information including email format and uniqueness checks
   * Requirements: 1.1, 1.2, 1.3
   */
  async validateProfileInfo(input: ProfileInfoInput): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Validate required fields
    if (!input.firstName?.trim()) {
      errors.push({ field: 'firstName', message: 'First name is required' });
    }

    if (!input.lastName?.trim()) {
      errors.push({ field: 'lastName', message: 'Last name is required' });
    }

    if (!input.jobTitle?.trim()) {
      errors.push({ field: 'jobTitle', message: 'Job title is required' });
    }

    if (!input.email?.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email)) {
        errors.push({ field: 'email', message: 'Invalid email format' });
      } else {
        // Check email uniqueness
        const existingUser = await this.userModel.findOne({
          where: { email: input.email }
        });
        if (existingUser) {
          errors.push({ field: 'email', message: 'Email address is already registered' });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
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
          [Op.iLike]: trimmedTitle
        },
        isActive: true
      }
    });

    // Create new job title if not found
    if (!jobTitle) {
      jobTitle = await this.jobTitleModel.create({
        title: trimmedTitle,
        isActive: true
      });
    }

    return jobTitle;
  }

  /**
   * Validates institution details with comprehensive validation
   * Requirements: 2.1, 2.2, 2.3
   */
  async validateInstitutionDetails(input: InstitutionDetailsInput): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Validate required fields
    if (!input.legalName?.trim()) {
      errors.push({ field: 'legalName', message: 'Legal name is required' });
    } else if (input.legalName.length > 255) {
      errors.push({ field: 'legalName', message: 'Legal name must be 255 characters or less' });
    }

    if (!input.institutionType) {
      errors.push({ field: 'institutionType', message: 'Institution type is required' });
    } else if (!Object.values(InstitutionType).includes(input.institutionType)) {
      errors.push({ field: 'institutionType', message: 'Invalid institution type' });
    }

    if (!input.accreditationNumber?.trim()) {
      errors.push({ field: 'accreditationNumber', message: 'Accreditation number is required' });
    } else if (input.accreditationNumber.length > 100) {
      errors.push({ field: 'accreditationNumber', message: 'Accreditation number must be 100 characters or less' });
    }

    // Validate address fields
    if (!input.streetAddress?.trim()) {
      errors.push({ field: 'streetAddress', message: 'Street address is required' });
    }

    if (!input.city?.trim()) {
      errors.push({ field: 'city', message: 'City is required' });
    }

    if (!input.stateProvince?.trim()) {
      errors.push({ field: 'stateProvince', message: 'State/Province is required' });
    }

    if (!input.zipPostalCode?.trim()) {
      errors.push({ field: 'zipPostalCode', message: 'ZIP/Postal code is required' });
    }

    // Validate optional website URL
    if (input.officialWebsite?.trim()) {
      try {
        new URL(input.officialWebsite);
      } catch {
        errors.push({ field: 'officialWebsite', message: 'Invalid website URL format' });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates admin credentials with username uniqueness and password strength
   * Requirements: 4.1, 4.2, 4.3
   */
  async validateAdminCredentials(input: AdminCredentialsInput): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Validate username
    if (!input.username?.trim()) {
      errors.push({ field: 'username', message: 'Username is required' });
    } else {
      // Check username uniqueness
      const existingUser = await this.userModel.findOne({
        where: { username: input.username }
      });
      if (existingUser) {
        errors.push({ field: 'username', message: 'Username is already taken' });
      }
    }

    // Validate password strength
    if (!input.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else {
      const passwordErrors = this.validatePasswordStrength(input.password);
      errors.push(...passwordErrors);
    }

    // Validate password confirmation
    if (!input.passwordConfirmation) {
      errors.push({ field: 'passwordConfirmation', message: 'Password confirmation is required' });
    } else if (input.password !== input.passwordConfirmation) {
      errors.push({ field: 'passwordConfirmation', message: 'Password confirmation does not match' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates password strength according to requirements
   * Requirements: 4.2
   */
  private validatePasswordStrength(password: string): ValidationError[] {
    const errors: ValidationError[] = [];

    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }

    if (!/[a-z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' });
    }

    if (!/[A-Z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' });
    }

    if (!/\d/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one number' });
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one special character' });
    }

    return errors;
  }

  /**
   * Updates registration status and creates audit trail
   * Requirements: 1.5, 2.5, 4.5
   */
  async updateRegistrationStatus(
    registrationId: number, 
    newStatus: RegistrationStatus,
    changedBy?: string,
    notes?: string,
    transaction?: Transaction
  ): Promise<void> {
    const registration = await this.registrationRecordModel.findByPk(registrationId, { transaction });
    
    if (!registration) {
      throw new BadRequestException('Registration record not found');
    }

    const previousStatus = registration.status;

    // Update registration status
    await registration.update({ status: newStatus }, { transaction });

    // Create status history entry
    await this.registrationStatusHistoryModel.create({
      registrationId,
      previousStatus,
      newStatus,
      changedAt: new Date(),
      changedBy,
      notes
    }, { transaction });
  }

  /**
   * Advances registration workflow to next step based on current status
   * Requirements: 1.5, 2.5, 4.5
   */
  async progressWorkflowState(
    registrationId: number,
    completedStep: 'profileInfo' | 'institutionDetails' | 'documents' | 'adminCredentials',
    transaction?: Transaction
  ): Promise<void> {
    const registration = await this.registrationRecordModel.findByPk(registrationId, { transaction });
    
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
    await this.updateRegistrationStatus(registrationId, newStatus, 'system', `Completed ${completedStep} step`, transaction);
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
      adminCredentialsCompleted: false
    });
  }

  /**
   * Gets registration status by ID
   */
  async getRegistrationStatus(registrationId: number): Promise<RegistrationRecordModel | null> {
    return await this.registrationRecordModel.findByPk(registrationId, {
      include: [
        { model: this.institutionModel },
        { model: this.userModel },
        { model: this.registrationStatusHistoryModel }
      ]
    });
  }

  /**
   * Hash password for storage
   */
  async hashPassword(password: string): Promise<string> {
    return await hash(password, this.saltOrRounds);
  }
}