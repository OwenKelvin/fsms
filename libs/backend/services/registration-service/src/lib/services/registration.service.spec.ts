import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationService } from './registration.service';
import { getModelToken } from '@nestjs/sequelize';
import {
  UserModel,
  InstitutionModel,
  JobTitleModel,
  RegistrationRecordModel,
  RegistrationStatusHistoryModel,
  RoleModel,
  RegistrationStatus,
} from '@fsms/backend/db';
import { Sequelize } from 'sequelize-typescript';
import { EmailService } from '@fsms/backend/email-service';
import { AuthServiceBackend } from '@fsms/backend/auth-service';
import { BadRequestException } from '@nestjs/common';

describe('RegistrationService - Approval and Rejection', () => {
  let service: RegistrationService;
  let registrationRecordModel: typeof RegistrationRecordModel;
  let registrationStatusHistoryModel: typeof RegistrationStatusHistoryModel;
  let institutionModel: typeof InstitutionModel;
  let sequelize: Sequelize;

  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  const mockSequelize = {
    transaction: jest.fn().mockResolvedValue(mockTransaction),
  };

  const mockEmailService = {
    send: jest.fn().mockResolvedValue(true),
  };

  const mockAuthService = {
    setupTwoFactorAuth: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        {
          provide: getModelToken(UserModel),
          useValue: {},
        },
        {
          provide: getModelToken(InstitutionModel),
          useValue: {
            findByPk: jest.fn(),
          },
        },
        {
          provide: getModelToken(JobTitleModel),
          useValue: {},
        },
        {
          provide: getModelToken(RegistrationRecordModel),
          useValue: {
            findByPk: jest.fn(),
          },
        },
        {
          provide: getModelToken(RegistrationStatusHistoryModel),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(RoleModel),
          useValue: {},
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: AuthServiceBackend,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
    registrationRecordModel = module.get(getModelToken(RegistrationRecordModel));
    registrationStatusHistoryModel = module.get(
      getModelToken(RegistrationStatusHistoryModel),
    );
    institutionModel = module.get(getModelToken(InstitutionModel));
    sequelize = module.get<Sequelize>(Sequelize);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('approveRegistration', () => {
    it('should approve a registration in UNDER_REVIEW status', async () => {
      const registrationId = 'test-registration-id';
      const adminUserId = 'test-admin-id';
      const notes = 'Approved after review';

      const mockRegistration = {
        id: registrationId,
        status: RegistrationStatus.UNDER_REVIEW,
        institution: { id: 'test-institution-id' },
        update: jest.fn().mockResolvedValue(true),
      };

      const mockUpdatedRegistration = {
        ...mockRegistration,
        status: RegistrationStatus.APPROVED,
      };

      jest.spyOn(registrationRecordModel, 'findByPk')
        .mockResolvedValueOnce(mockRegistration as any)
        .mockResolvedValueOnce(mockUpdatedRegistration as any);

      jest.spyOn(registrationStatusHistoryModel, 'create').mockResolvedValue({} as any);

      const result = await service.approveRegistration(
        registrationId,
        adminUserId,
        notes,
      );

      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
      expect(mockRegistration.update).toHaveBeenCalledWith(
        { status: RegistrationStatus.APPROVED },
        { transaction: mockTransaction },
      );
      expect(registrationStatusHistoryModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          registrationId,
          newStatus: RegistrationStatus.APPROVED,
          changedBy: adminUserId,
          notes,
        }),
        { transaction: mockTransaction },
      );
      expect(result.status).toBe(RegistrationStatus.APPROVED);
    });

    it('should throw error if registration not found', async () => {
      jest.spyOn(registrationRecordModel, 'findByPk').mockResolvedValue(null);

      await expect(
        service.approveRegistration('invalid-id', 'admin-id'),
      ).rejects.toThrow(BadRequestException);

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
    });

    it('should throw error if registration is not in UNDER_REVIEW status', async () => {
      const mockRegistration = {
        id: 'test-id',
        status: RegistrationStatus.APPROVED,
        institution: { id: 'test-institution-id' },
      };

      jest.spyOn(registrationRecordModel, 'findByPk').mockResolvedValue(mockRegistration as any);

      await expect(
        service.approveRegistration('test-id', 'admin-id'),
      ).rejects.toThrow(BadRequestException);

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should throw error if institution not found', async () => {
      const mockRegistration = {
        id: 'test-id',
        status: RegistrationStatus.UNDER_REVIEW,
        institution: null,
      };

      jest.spyOn(registrationRecordModel, 'findByPk').mockResolvedValue(mockRegistration as any);

      await expect(
        service.approveRegistration('test-id', 'admin-id'),
      ).rejects.toThrow(BadRequestException);

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe('rejectRegistration', () => {
    it('should reject a registration in UNDER_REVIEW status', async () => {
      const registrationId = 'test-registration-id';
      const adminUserId = 'test-admin-id';
      const reason = 'Missing required documents';

      const mockRegistration = {
        id: registrationId,
        status: RegistrationStatus.UNDER_REVIEW,
        update: jest.fn().mockResolvedValue(true),
      };

      const mockUpdatedRegistration = {
        ...mockRegistration,
        status: RegistrationStatus.REJECTED,
      };

      jest.spyOn(registrationRecordModel, 'findByPk')
        .mockResolvedValueOnce(mockRegistration as any)
        .mockResolvedValueOnce(mockUpdatedRegistration as any);

      jest.spyOn(registrationStatusHistoryModel, 'create').mockResolvedValue({} as any);

      const result = await service.rejectRegistration(
        registrationId,
        adminUserId,
        reason,
      );

      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
      expect(mockRegistration.update).toHaveBeenCalledWith(
        { status: RegistrationStatus.REJECTED },
        { transaction: mockTransaction },
      );
      expect(registrationStatusHistoryModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          registrationId,
          newStatus: RegistrationStatus.REJECTED,
          changedBy: adminUserId,
          notes: reason,
        }),
        { transaction: mockTransaction },
      );
      expect(result.status).toBe(RegistrationStatus.REJECTED);
    });

    it('should throw error if reason is not provided', async () => {
      await expect(
        service.rejectRegistration('test-id', 'admin-id', ''),
      ).rejects.toThrow(BadRequestException);

      expect(mockTransaction.commit).not.toHaveBeenCalled();
    });

    it('should throw error if reason is only whitespace', async () => {
      await expect(
        service.rejectRegistration('test-id', 'admin-id', '   '),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if registration not found', async () => {
      jest.spyOn(registrationRecordModel, 'findByPk').mockResolvedValue(null);

      await expect(
        service.rejectRegistration('invalid-id', 'admin-id', 'reason'),
      ).rejects.toThrow(BadRequestException);

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
    });

    it('should throw error if registration is not in UNDER_REVIEW status', async () => {
      const mockRegistration = {
        id: 'test-id',
        status: RegistrationStatus.REJECTED,
      };

      jest.spyOn(registrationRecordModel, 'findByPk').mockResolvedValue(mockRegistration as any);

      await expect(
        service.rejectRegistration('test-id', 'admin-id', 'reason'),
      ).rejects.toThrow(BadRequestException);

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
});
