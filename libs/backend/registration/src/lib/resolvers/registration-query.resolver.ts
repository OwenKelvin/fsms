import { Args, Query, Resolver } from '@nestjs/graphql';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { RegistrationService } from '@fsms/backend/registration-backend-service';
import { RegistrationStatusResponseDto } from '../dto/registration-status-response.dto';
import { RegistrationDetailsResponseDto } from '../dto/registration-details-response.dto';
import { RegistrationFilterInputDto } from '../dto/registration-filter-input.dto';
import { RegistrationStatus } from '@fsms/backend/db';

@Resolver()
export class RegistrationQueryResolver {
  constructor(private readonly registrationService: RegistrationService) {}

  /**
   * Gets registration status by ID
   * Requirements: 7.3
   */
  @Query(() => RegistrationStatusResponseDto, { nullable: true })
  async getRegistrationStatus(
    @Args('registrationId') registrationId: string,
  ): Promise<RegistrationStatusResponseDto | null> {
    try {
      const registration =
        await this.registrationService.getRegistrationStatus(registrationId);

      if (!registration) {
        return null;
      }

      return {
        id: registration.id,
        status: registration.status,
        profileInfoCompleted: registration.profileInfoCompleted,
        institutionDetailsCompleted: registration.institutionDetailsCompleted,
        documentsUploaded: registration.documentsUploaded,
        adminCredentialsCompleted: registration.adminCredentialsCompleted,
        createdAt: registration.createdAt,
        updatedAt: registration.updatedAt,
        completedAt: registration.completedAt,
        institutionId: registration.institutionId,
        adminUserId: registration.adminUserId,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error retrieving registration status');
    }
  }

  /**
   * Gets detailed registration information by ID
   * Requirements: 7.3
   */
  @Query(() => RegistrationDetailsResponseDto, { nullable: true })
  async getRegistrationDetails(
    @Args('registrationId') registrationId: string,
  ): Promise<RegistrationDetailsResponseDto | null> {
    try {
      const registration =
        await this.registrationService.getRegistrationStatus(registrationId);

      if (!registration) {
        return null;
      }

      // Get status history
      const statusHistory =
        await this.registrationService.getRegistrationStatusHistory(
          registrationId,
        );

      return {
        id: registration.id,
        status: registration.status,
        profileInfoCompleted: registration.profileInfoCompleted,
        institutionDetailsCompleted: registration.institutionDetailsCompleted,
        documentsUploaded: registration.documentsUploaded,
        adminCredentialsCompleted: registration.adminCredentialsCompleted,
        createdAt: registration.createdAt,
        updatedAt: registration.updatedAt,
        completedAt: registration.completedAt,
        institutionId: registration.institutionId,
        adminUserId: registration.adminUserId,
        institution: registration.institution,
        adminUser: registration.adminUser,
        statusHistory: statusHistory.map((history) => ({
          id: history.id,
          previousStatus: history.previousStatus,
          newStatus: history.newStatus,
          changedAt: history.changedAt,
          changedBy: history.changedBy,
          notes: history.notes,
        })),
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error retrieving registration details');
    }
  }

  /**
   * Gets registrations with filtering capabilities for admin queries
   * Requirements: 7.3
   */
  @Query(() => [RegistrationDetailsResponseDto])
  async getRegistrations(
    @Args('filter', { nullable: true }, new ValidationPipe())
    filter?: RegistrationFilterInputDto,
  ): Promise<RegistrationDetailsResponseDto[]> {
    try {
      let registrations;

      if (!filter) {
        // Get all registrations if no filter provided
        registrations =
          await this.registrationService.getRegistrationsByStatuses(
            Object.values(RegistrationStatus),
          );
      } else if (filter.statuses && filter.statuses.length > 0) {
        // Filter by multiple statuses
        registrations =
          await this.registrationService.getRegistrationsByStatuses(
            filter.statuses,
          );
      } else if (filter.status) {
        // Filter by single status
        registrations = await this.registrationService.getRegistrationsByStatus(
          filter.status,
        );
      } else if (filter.startDate && filter.endDate) {
        // Filter by date range
        const startDate = new Date(filter.startDate);
        const endDate = new Date(filter.endDate);
        registrations =
          await this.registrationService.getRegistrationsByDateRange(
            startDate,
            endDate,
            filter.status,
          );
      } else {
        // Default to all registrations
        registrations =
          await this.registrationService.getRegistrationsByStatuses(
            Object.values(RegistrationStatus),
          );
      }

      // Transform to response DTOs
      const results = await Promise.all(
        registrations.map(async (registration) => {
          const statusHistory =
            await this.registrationService.getRegistrationStatusHistory(
              registration.id,
            );

          return {
            id: registration.id,
            status: registration.status,
            profileInfoCompleted: registration.profileInfoCompleted,
            institutionDetailsCompleted:
              registration.institutionDetailsCompleted,
            documentsUploaded: registration.documentsUploaded,
            adminCredentialsCompleted: registration.adminCredentialsCompleted,
            createdAt: registration.createdAt,
            updatedAt: registration.updatedAt,
            completedAt: registration.completedAt,
            institutionId: registration.institutionId,
            adminUserId: registration.adminUserId,
            institution: registration.institution,
            adminUser: registration.adminUser,
            statusHistory: statusHistory.map((history) => ({
              id: history.id,
              previousStatus: history.previousStatus,
              newStatus: history.newStatus,
              changedAt: history.changedAt,
              changedBy: history.changedBy,
              notes: history.notes,
            })),
          };
        }),
      );

      return results;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error retrieving registrations');
    }
  }

  /**
   * Gets registrations that require manual review
   * Requirements: 7.3
   */
  @Query(() => [RegistrationDetailsResponseDto])
  async getRegistrationsRequiringReview(): Promise<
    RegistrationDetailsResponseDto[]
  > {
    try {
      const registrations =
        await this.registrationService.getRegistrationsRequiringReview();
      // Transform to response DTOs
      const results = await Promise.all(
        registrations.map(async (registration) => {
          const statusHistory =
            await this.registrationService.getRegistrationStatusHistory(
              registration.id,
            );

          return {
            id: registration.id,
            status: registration.status,
            profileInfoCompleted: registration.profileInfoCompleted,
            institutionDetailsCompleted:
              registration.institutionDetailsCompleted,
            documentsUploaded: registration.documentsUploaded,
            adminCredentialsCompleted: registration.adminCredentialsCompleted,
            createdAt: registration.createdAt,
            updatedAt: registration.updatedAt,
            completedAt: registration.completedAt,
            institutionId: registration.institutionId,
            adminUserId: registration.adminUserId,
            institution: registration.institution,
            adminUser: registration.adminUser,
            statusHistory: statusHistory.map((history) => ({
              id: history.id,
              previousStatus: history.previousStatus,
              newStatus: history.newStatus,
              changedAt: history.changedAt,
              changedBy: history.changedBy,
              notes: history.notes,
            })),
          };
        }),
      );

      return results;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Error retrieving registrations requiring review',
      );
    }
  }
}
