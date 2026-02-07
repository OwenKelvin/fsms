import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationResolver } from './registration.resolver';
import { RegistrationService } from '@fsms/backend/registration-backend-service';
import { BadRequestException } from '@nestjs/common';
import { RegistrationStatus } from '@fsms/backend/db';

describe('RegistrationResolver - Approval and Rejection', () => {
  let resolver: RegistrationResolver;
  let registrationService: jest.Mocked<RegistrationService>;

  beforeEach(async () => {
    const mockRegistrationService = {
      approveRegistration: jest.fn(),
      rejectRegistration: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationResolver,
        {
          provide: RegistrationService,
          useValue: mockRegistrationService,
        },
      ],
    }).compile();

    resolver = module.get<RegistrationResolver>(RegistrationResolver);
    registrationService = module.get(RegistrationService);
  });

  describe('approveRegistration', () => {
    it('should approve a registration successfully', async () => {
      const mockUser = { id: 'admin-user-id' };
      const input = {
        registrationId: 'test-registration-id',
        notes: 'Approved after review',
      };

      const mockRegistration = {
        id: 'test-registration-id',
        status: RegistrationStatus.APPROVED,
        profileInfoCompleted: true,
        institutionDetailsCompleted: true,
        documentsUploaded: true,
        adminCredentialsCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date(),
        institutionId: 'institution-id',
        adminUserId: 'admin-user-id',
      };

      registrationService.approveRegistration.mockResolvedValue(
        mockRegistration as any,
      );

      const result = await resolver.approveRegistration(input, mockUser);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Registration approved successfully');
      expect(result.registration).toBeDefined();
      expect(result.registration?.status).toBe(RegistrationStatus.APPROVED);
      expect(registrationService.approveRegistration).toHaveBeenCalledWith(
        input.registrationId,
        mockUser.id,
        input.notes,
      );
    });

    it('should return error if user is not authenticated', async () => {
      const input = {
        registrationId: 'test-registration-id',
        notes: 'Approved after review',
      };

      const result = await resolver.approveRegistration(input, undefined);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Authentication required');
      expect(registrationService.approveRegistration).not.toHaveBeenCalled();
    });

    it('should return error if registration ID is missing', async () => {
      const mockUser = { id: 'admin-user-id' };
      const input = {
        registrationId: '',
      };

      const result = await resolver.approveRegistration(input, mockUser);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Registration ID is required');
      expect(registrationService.approveRegistration).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const mockUser = { id: 'admin-user-id' };
      const input = {
        registrationId: 'test-registration-id',
      };

      registrationService.approveRegistration.mockRejectedValue(
        new BadRequestException('Registration not found'),
      );

      const result = await resolver.approveRegistration(input, mockUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Registration not found');
    });
  });

  describe('rejectRegistration', () => {
    it('should reject a registration successfully', async () => {
      const mockUser = { id: 'admin-user-id' };
      const input = {
        registrationId: 'test-registration-id',
        reason: 'Missing required documents',
      };

      const mockRegistration = {
        id: 'test-registration-id',
        status: RegistrationStatus.REJECTED,
        profileInfoCompleted: true,
        institutionDetailsCompleted: true,
        documentsUploaded: false,
        adminCredentialsCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
        institutionId: 'institution-id',
        adminUserId: 'admin-user-id',
      };

      registrationService.rejectRegistration.mockResolvedValue(
        mockRegistration as any,
      );

      const result = await resolver.rejectRegistration(input, mockUser);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Registration rejected successfully');
      expect(result.registration).toBeDefined();
      expect(result.registration?.status).toBe(RegistrationStatus.REJECTED);
      expect(registrationService.rejectRegistration).toHaveBeenCalledWith(
        input.registrationId,
        mockUser.id,
        input.reason,
      );
    });

    it('should return error if user is not authenticated', async () => {
      const input = {
        registrationId: 'test-registration-id',
        reason: 'Missing required documents',
      };

      const result = await resolver.rejectRegistration(input, undefined);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Authentication required');
      expect(registrationService.rejectRegistration).not.toHaveBeenCalled();
    });

    it('should return error if registration ID is missing', async () => {
      const mockUser = { id: 'admin-user-id' };
      const input = {
        registrationId: '',
        reason: 'Missing required documents',
      };

      const result = await resolver.rejectRegistration(input, mockUser);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Registration ID is required');
      expect(registrationService.rejectRegistration).not.toHaveBeenCalled();
    });

    it('should return error if reason is missing', async () => {
      const mockUser = { id: 'admin-user-id' };
      const input = {
        registrationId: 'test-registration-id',
        reason: '',
      };

      const result = await resolver.rejectRegistration(input, mockUser);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Rejection reason is required');
      expect(registrationService.rejectRegistration).not.toHaveBeenCalled();
    });

    it('should return error if reason is only whitespace', async () => {
      const mockUser = { id: 'admin-user-id' };
      const input = {
        registrationId: 'test-registration-id',
        reason: '   ',
      };

      const result = await resolver.rejectRegistration(input, mockUser);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Rejection reason is required');
      expect(registrationService.rejectRegistration).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const mockUser = { id: 'admin-user-id' };
      const input = {
        registrationId: 'test-registration-id',
        reason: 'Missing required documents',
      };

      registrationService.rejectRegistration.mockRejectedValue(
        new BadRequestException('Registration not found'),
      );

      const result = await resolver.rejectRegistration(input, mockUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Registration not found');
    });
  });
});
