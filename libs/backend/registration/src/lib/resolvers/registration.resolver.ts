import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ProfileInfoInputDto } from '../dto/profile-info-input.dto';
import { InstitutionDetailsInputDto } from '../dto/institution-details-input.dto';
import { AdminCredentialsInputDto } from '../dto/admin-credentials-input.dto';
import { RegistrationStepResponseDto } from '../dto/registration-step-response.dto';
import { CompleteRegistrationResponseDto } from '../dto/complete-registration-response.dto';
import {
  CompleteRegistrationData,
  RegistrationService,
} from '@fsms/backend/registration-backend-service';

@Resolver()
export class RegistrationResolver {
  constructor(private readonly registrationService: RegistrationService) {}

  /**
   * Submits profile information for registration
   * Requirements: 7.1, 7.2
   */
  @Mutation(() => RegistrationStepResponseDto)
  async submitProfileInfo(
    @Args('input', new ValidationPipe()) input: ProfileInfoInputDto,
    @Args('registrationId', { nullable: true }) registrationId?: string,
  ): Promise<RegistrationStepResponseDto> {
    try {
      // Validate profile information
      const validation =
        await this.registrationService.validateProfileInfo(input);

      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors.map((error) => ({
            field: error.field,
            message: error.message,
          })),
        };
      }

      // Create or get registration record
      let registration;
      if (registrationId) {
        registration =
          await this.registrationService.getRegistrationStatus(registrationId);
        if (!registration) {
          throw new BadRequestException('Registration record not found');
        }
      } else {
        registration =
          await this.registrationService.createRegistrationRecord();
      }

      // Progress workflow state
      await this.registrationService.progressWorkflowState(
        registration.id,
        'profileInfo',
      );

      return {
        success: true,
        registrationId: registration.id,
        message: 'Profile information submitted successfully',
      };
    } catch (error: any) {
      console.log(error);
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

      return {
        success: false,
        errors: [{ field: 'general', message: 'An unexpected error occurred' }],
      };
    }
  }

  /**
   * Submits institution details for registration
   * Requirements: 7.1, 7.2
   */
  @Mutation(() => RegistrationStepResponseDto)
  async submitInstitutionDetails(
    @Args('input', new ValidationPipe()) input: InstitutionDetailsInputDto,
    @Args('registrationId') registrationId: string,
  ): Promise<RegistrationStepResponseDto> {
    try {
      // Validate institution details
      const validation =
        await this.registrationService.validateInstitutionDetails(input);

      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors.map((error) => ({
            field: error.field,
            message: error.message,
          })),
        };
      }

      // Verify registration exists
      const registration =
        await this.registrationService.getRegistrationStatus(registrationId);
      if (!registration) {
        throw new BadRequestException('Registration record not found');
      }

      // Progress workflow state
      await this.registrationService.progressWorkflowState(
        registrationId,
        'institutionDetails',
      );

      return {
        success: true,
        registrationId,
        message: 'Institution details submitted successfully',
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

      return {
        success: false,
        errors: [{ field: 'general', message: 'An unexpected error occurred' }],
      };
    }
  }

  /**
   * Submits admin credentials for registration
   * Requirements: 7.1, 7.2
   */
  @Mutation(() => RegistrationStepResponseDto)
  async submitAdminCredentials(
    @Args('input', new ValidationPipe()) input: AdminCredentialsInputDto,
    @Args('registrationId') registrationId: string,
  ): Promise<RegistrationStepResponseDto> {
    try {
      // Validate admin credentials
      const validation =
        await this.registrationService.validateAdminCredentials(input);

      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors.map((error) => ({
            field: error.field,
            message: error.message,
          })),
        };
      }

      // Verify registration exists
      const registration =
        await this.registrationService.getRegistrationStatus(registrationId);
      if (!registration) {
        throw new BadRequestException('Registration record not found');
      }

      // Progress workflow state
      await this.registrationService.progressWorkflowState(
        registrationId,
        'adminCredentials',
      );

      return {
        success: true,
        registrationId,
        message: 'Admin credentials submitted successfully',
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

      return {
        success: false,
        errors: [{ field: 'general', message: 'An unexpected error occurred' }],
      };
    }
  }

  /**
   * Completes the registration process atomically
   * Requirements: 7.1, 7.2
   */
  @Mutation(() => CompleteRegistrationResponseDto)
  async completeRegistration(
    @Args('registrationId') registrationId: string,
    @Args('profileInfo', new ValidationPipe()) profileInfo: ProfileInfoInputDto,
    @Args('institutionDetails', new ValidationPipe())
    institutionDetails: InstitutionDetailsInputDto,
    @Args('adminCredentials', new ValidationPipe())
    adminCredentials: AdminCredentialsInputDto,
  ): Promise<CompleteRegistrationResponseDto> {
    try {
      // Prepare complete registration data
      const registrationData: CompleteRegistrationData = {
        profileInfo,
        institutionDetails,
        adminCredentials,
      };

      // Complete registration atomically
      const result = await this.registrationService.completeRegistration(
        registrationId,
        registrationData,
      );

      if (result.success) {
        return {
          success: true,
          institutionId: result.institutionId,
          adminUserId: result.adminUserId,
          message: 'Registration completed successfully',
        };
      } else {
        return {
          success: false,
          errors: result.errors?.map((error) => ({
            field: error.field,
            message: error.message,
          })),
        };
      }
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

      return {
        success: false,
        errors: [{ field: 'general', message: 'An unexpected error occurred' }],
      };
    }
  }
}
