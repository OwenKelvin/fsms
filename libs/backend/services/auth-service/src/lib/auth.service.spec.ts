import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { UserModel } from '@fsms/backend/db';
import { UserService } from '@fsms/backend/user-service';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

// Mock external dependencies
jest.mock('speakeasy');
jest.mock('qrcode');
jest.mock('googleapis', () => {
  class OAuth2 {
    verifyIdToken = () => ({
      getPayload: () => ({ email: 'test@xample.com' }),
    });
  }

  return {
    google: {
      auth: {
        OAuth2,
      },
    },
  };
});

// Mock the UserService and JwtService
const mockUserService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'JWT_SECRET', useValue: '1234' },
        {
          provide: 'KEYV_REDIS',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signInGoogleUser', () => {
    it('should return user when email is found', async () => {
      const fakeUser: Partial<UserModel> = {
        id: '1',
        email: 'test@example.com',
      };
      mockUserService.findByEmail.mockResolvedValueOnce(fakeUser);
      const result = await service.signInGoogleUser('fakeToken');
      expect(result).toEqual(fakeUser);
    });

    it('should throw BadRequestException when no user found with given email', async () => {
      mockUserService.findByEmail.mockResolvedValueOnce(null);
      await expect(service.signInGoogleUser('fakeToken')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return null when payload or email is missing', async () => {
      jest.mock('googleapis', () => {
        class OAuth2 {
          verifyIdToken = () => ({
            getPayload: () => ({}),
          });
        }

        return {
          google: {
            auth: {
              OAuth2,
            },
          },
        };
      });

      await expect(service.signInGoogleUser('fakeToken')).rejects.toThrow(
        'No user found with email test@xample.com',
      );
    });
  });

  describe('login', () => {
    it('should return user with access and refresh tokens', async () => {
      const fakeUser: Partial<UserModel> = {
        id: '1',
        email: 'test@example.com',
      };
      const fakeAccessToken = 'fakeAccessToken';
      const fakeRefreshToken = 'fakeRefreshToken';
      mockJwtService.sign.mockReturnValueOnce(fakeAccessToken);
      mockJwtService.sign.mockReturnValueOnce(fakeRefreshToken);
      const result = await service.login(fakeUser as UserModel);
      expect(result?.user).toEqual(fakeUser);
      expect(result?.accessToken).toEqual(fakeAccessToken);
      expect(result?.refreshToken).toEqual(fakeRefreshToken);
    });

    it('should return undefined when user is null', async () => {
      const result = await service.login(null);
      expect(result).toBeUndefined();
    });
  });

  describe('Two-Factor Authentication', () => {
    const mockUser: Partial<UserModel> = {
      id: '1',
      email: 'test@example.com',
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: null,
      save: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('setupTwoFactorAuth', () => {
      it('should setup 2FA for a user', async () => {
        const mockSecret = {
          base32: 'JBSWY3DPEHPK3PXP',
          otpauth_url: 'otpauth://totp/FSMS%20(test@example.com)?secret=JBSWY3DPEHPK3PXP&issuer=FSMS',
        };
        const mockQrCodeUrl = 'data:image/png;base64,mockqrcode';

        mockUserService.findById.mockResolvedValue(mockUser);
        (speakeasy.generateSecret as jest.Mock).mockReturnValue(mockSecret);
        (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockQrCodeUrl);

        const result = await service.setupTwoFactorAuth('1');

        expect(result).toEqual({
          secret: 'JBSWY3DPEHPK3PXP',
          qrCodeUrl: mockQrCodeUrl,
          backupCodes: expect.any(Array),
        });
        expect(result.backupCodes).toHaveLength(10);
        expect(mockUser.save).toHaveBeenCalled();
      });

      it('should throw BadRequestException when user not found', async () => {
        mockUserService.findById.mockResolvedValue(null);

        await expect(service.setupTwoFactorAuth('1')).rejects.toThrow(
          BadRequestException,
        );
      });
    });

    describe('enableTwoFactorAuth', () => {
      it('should enable 2FA after verifying token', async () => {
        const userWithSecret = {
          ...mockUser,
          twoFactorSecret: 'JBSWY3DPEHPK3PXP',
        };

        mockUserService.findById.mockResolvedValue(userWithSecret);
        (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);

        const result = await service.enableTwoFactorAuth('1', '123456');

        expect(result).toBe(true);
        expect(userWithSecret.twoFactorEnabled).toBe(true);
        expect(userWithSecret.save).toHaveBeenCalled();
      });

      it('should throw BadRequestException when token is invalid', async () => {
        const userWithSecret = {
          ...mockUser,
          twoFactorSecret: 'JBSWY3DPEHPK3PXP',
        };

        mockUserService.findById.mockResolvedValue(userWithSecret);
        (speakeasy.totp.verify as jest.Mock).mockReturnValue(false);

        await expect(service.enableTwoFactorAuth('1', '123456')).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should throw BadRequestException when user has no secret', async () => {
        mockUserService.findById.mockResolvedValue(mockUser);

        await expect(service.enableTwoFactorAuth('1', '123456')).rejects.toThrow(
          BadRequestException,
        );
      });
    });

    describe('disableTwoFactorAuth', () => {
      it('should disable 2FA after verifying token', async () => {
        const userWith2FA = {
          ...mockUser,
          twoFactorEnabled: true,
          twoFactorSecret: 'JBSWY3DPEHPK3PXP',
        };

        mockUserService.findById.mockResolvedValue(userWith2FA);
        (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);

        const result = await service.disableTwoFactorAuth('1', '123456');

        expect(result).toBe(true);
        expect(userWith2FA.twoFactorEnabled).toBe(false);
        expect(userWith2FA.twoFactorSecret).toBe(null);
        expect(userWith2FA.twoFactorBackupCodes).toBe(null);
        expect(userWith2FA.save).toHaveBeenCalled();
      });

      it('should throw BadRequestException when 2FA not enabled', async () => {
        mockUserService.findById.mockResolvedValue(mockUser);

        await expect(service.disableTwoFactorAuth('1', '123456')).rejects.toThrow(
          BadRequestException,
        );
      });
    });

    describe('verifyTwoFactorToken', () => {
      it('should verify TOTP token', async () => {
        const userWith2FA = {
          ...mockUser,
          twoFactorEnabled: true,
          twoFactorSecret: 'JBSWY3DPEHPK3PXP',
        };

        (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);

        const result = await service.verifyTwoFactorToken(userWith2FA as UserModel, {
          token: '123456',
        });

        expect(result).toBe(true);
      });

      it('should verify backup code', async () => {
        const userWith2FA = {
          ...mockUser,
          twoFactorEnabled: true,
          twoFactorSecret: 'JBSWY3DPEHPK3PXP',
          twoFactorBackupCodes: JSON.stringify(['BACKUP123', 'BACKUP456']),
          save: jest.fn(),
        };

        const result = await service.verifyTwoFactorToken(userWith2FA as UserModel, {
          token: '',
          backupCode: 'BACKUP123',
        });

        expect(result).toBe(true);
        expect(userWith2FA.save).toHaveBeenCalled();
        expect(JSON.parse(userWith2FA.twoFactorBackupCodes)).toEqual(['BACKUP456']);
      });

      it('should return false for invalid backup code', async () => {
        const userWith2FA = {
          ...mockUser,
          twoFactorEnabled: true,
          twoFactorSecret: 'JBSWY3DPEHPK3PXP',
          twoFactorBackupCodes: JSON.stringify(['BACKUP123', 'BACKUP456']),
        };

        const result = await service.verifyTwoFactorToken(userWith2FA as UserModel, {
          token: '',
          backupCode: 'INVALID',
        });

        expect(result).toBe(false);
      });

      it('should return false when 2FA not enabled', async () => {
        const result = await service.verifyTwoFactorToken(mockUser as UserModel, {
          token: '123456',
        });

        expect(result).toBe(false);
      });
    });

    describe('regenerateBackupCodes', () => {
      it('should regenerate backup codes after verifying token', async () => {
        const userWith2FA = {
          ...mockUser,
          twoFactorEnabled: true,
          twoFactorSecret: 'JBSWY3DPEHPK3PXP',
          twoFactorBackupCodes: JSON.stringify(['OLD1', 'OLD2']),
          save: jest.fn(),
        };

        mockUserService.findById.mockResolvedValue(userWith2FA);
        (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);

        const result = await service.regenerateBackupCodes('1', '123456');

        expect(result).toHaveLength(10);
        expect(userWith2FA.save).toHaveBeenCalled();
        expect(JSON.parse(userWith2FA.twoFactorBackupCodes)).not.toEqual(['OLD1', 'OLD2']);
      });

      it('should throw BadRequestException when 2FA not enabled', async () => {
        mockUserService.findById.mockResolvedValue(mockUser);

        await expect(service.regenerateBackupCodes('1', '123456')).rejects.toThrow(
          BadRequestException,
        );
      });
    });
  });
});
