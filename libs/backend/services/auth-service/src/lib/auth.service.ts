import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth, google } from 'googleapis';
import { UserModel } from '@fsms/backend/db';
import { UserService } from '@fsms/backend/user-service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { JwtPayload, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import Keyv from 'keyv';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

interface RegisterInputDto {
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirmation: string;
  email: string;
}

interface LoginInputDto {
  email: string;

  password: string;
}

interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

interface TwoFactorVerification {
  token: string;
  backupCode?: string;
}

const parseTimeSpan = (timeSpan: string): number => {
  // Remove any extra spaces and convert to lowercase for consistency
  timeSpan = timeSpan.trim().toLowerCase();

  // Regular expressions for matching different time formats
  const numberRegex = /^(\d+)$/; // Matches a simple number like "60"
  const dayRegex = /^(\d+)\s*(d|day|days)$/; // Matches "2 days", "3d"
  const hourRegex = /^(\d+)\s*(h|hour|hours)$/; // Matches "10h", "5 hours"
  const minuteRegex = /^(\d+)\s*(m|minute|minutes)$/; // Matches "30m", "15 minutes"
  const secondRegex = /^(\d+)\s*(s|second|seconds)$/; // Matches "100s", "45 seconds"

  // Matching the time span against different patterns
  let match;

  if ((match = timeSpan.match(numberRegex))) {
    // Simple number (seconds)
    return parseInt(match[1]) * 1000; // Convert to milliseconds
  } else if ((match = timeSpan.match(dayRegex))) {
    // Days
    return parseInt(match[1]) * 24 * 60 * 60 * 1000; // Convert to milliseconds
  } else if ((match = timeSpan.match(hourRegex))) {
    // Hours
    return parseInt(match[1]) * 60 * 60 * 1000; // Convert to milliseconds
  } else if ((match = timeSpan.match(minuteRegex))) {
    // Minutes
    return parseInt(match[1]) * 60 * 1000; // Convert to milliseconds
  } else if ((match = timeSpan.match(secondRegex))) {
    // Seconds
    return parseInt(match[1]) * 1000; // Convert to milliseconds
  } else {
    // If the format is unrecognized, return 0 or handle accordingly
    throw new Error(`Unrecognized time span format: ${timeSpan}`);
  }
};

@Injectable()
export class AuthService {
  saltRounds = 10;
  private oauthClient?: Auth.OAuth2Client = new google.auth.OAuth2(
    process.env?.['FSMS_GOOGLE_CLIENT_ID'] ?? '',
    process.env?.['FSMS_GOOGLE_CLIENT_SECRET'] ?? '',
  );
  private accessTokenExpiryPeriod =
    process.env?.['FSMS_EXPIRY_PERIOD_ACCESS_TOKEN'] ?? '300s';
  private refreshTokenExpiryPeriod =
    process.env?.['FSMS_EXPIRY_PERIOD_REFRESH_TOKEN'] ?? '7d';

  constructor(
    @Inject('JWT_SECRET') private jwtSecret: string,
    private userService: UserService,
    private jwtService: JwtService,
    @Inject('KEYV_REDIS') private readonly keyvRedis: Keyv,
  ) {}

  async signupGoogleUser(idToken: string) {
    const tokenInfo = await this.oauthClient?.verifyIdToken({
      idToken,
    });
    const payload = tokenInfo?.getPayload();
    const password = this.userService.generatePassword();
    if (payload && payload.email) {
      const user = await this.userService.findByEmail(
        tokenInfo?.getPayload()?.email ?? '',
      );
      if (!user) {
        const {
          ['picture']: profilePhotoLink = '',
          email,
          ['given_name']: firstName = '',
          ['family_name']: lastName = '',
        } = payload;
        const hashedPassword = await this.userService.hashPassword(password);
        return await this.userService.create({
          email,
          username: email,
          profilePhotoLink,
          firstName,
          lastName,
          middleName: '',
          isAdmin: true,
          phone: '',
          password: hashedPassword,
        });
      } else {
        throw new BadRequestException(
          `User with email ${payload.email} already exists`,
        );
      }
    } else {
      return null;
    }
  }

  async signInOrSignUpGoogleUser(idToken: string) {
    let tokenInfoPayload: Auth.TokenPayload | undefined = {
      aud: '',
      exp: 0,
      iat: 0,
      iss: '',
      sub: '',
    };

    const jwtRegEx =
      /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/;
    if (!jwtRegEx.test(idToken)) {
      const googleInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
      const response = await fetch(`${googleInfoUrl}?access_token=${idToken}`);
      tokenInfoPayload = await response.json();
    } else {
      const tokenInfo = await this.oauthClient?.verifyIdToken({
        idToken,
      });
      tokenInfoPayload = tokenInfo?.getPayload();
    }

    if (tokenInfoPayload && tokenInfoPayload.email) {
      const user = await this.userService.findByEmail(
        tokenInfoPayload.email ?? '',
      );
      if (!user) {
        const {
          ['picture']: profilePhotoLink = '',
          email,
          ['given_name']: firstName = '',
          ['family_name']: lastName = '',
        } = tokenInfoPayload;
        const hashedPassword = await this.userService.hashPassword(
          this.userService.generatePassword(),
        );
        return {
          user: await this.userService.create({
            email,
            username: email,
            profilePhotoLink,
            firstName,
            lastName,
            middleName: '',
            isAdmin: true,
            phone: '',
            password: hashedPassword,
            emailVerifiedAt: new Date(),
          }),
          created: true,
        };
      }
      if (!user.emailVerifiedAt) {
        user.emailVerifiedAt = new Date();
        await user.save();
      }

      if (!user.profilePhotoLink) {
        user.profilePhotoLink = tokenInfoPayload.picture;
        await user.save();
      }
      return { user, created: false };
    } else {
      return null;
    }
  }

  async signInGoogleUser(idToken: string): Promise<UserModel | null> {
    const tokenInfo = await this.oauthClient?.verifyIdToken({
      idToken,
    });
    const payload = tokenInfo?.getPayload();
    if (payload && payload.email) {
      const user = await this.userService.findByEmail(
        tokenInfo?.getPayload()?.email ?? '',
      );
      if (!user) {
        throw new BadRequestException(
          `No user found with email ${payload.email}`,
        );
      }
      return user;
    } else {
      return null;
    }
  }

  async login(
    user: UserModel | null,
    deviceType: 'web' | 'mobile' = 'web',
    sessionId?: string,
  ) {
    if (!user) {
      return;
    }

    let currentSession: string | undefined;
    if (sessionId) {
      currentSession = await this.keyvRedis.get(
        `session:${user.id}:${deviceType}`,
      );
      if (!currentSession || currentSession !== sessionId) {
        throw new UnauthorizedException(
          'This session is invalid, please try again.',
        );
      }
    } else {
      sessionId = uuid();
    }

    const payload = {
      email: user.email,
      sub: user.id,
      sessionId,
    };

    await this.keyvRedis.set(
      `session:${user.id}:${deviceType}`,
      sessionId,
      parseTimeSpan(this.accessTokenExpiryPeriod),
    );

    return {
      user: user,
      accessToken: this.jwtService.sign(
        { ...payload, type: 'AuthToken', sessionId },
        { secret: this.jwtSecret, expiresIn: this.accessTokenExpiryPeriod as any },
      ),
      refreshToken: this.jwtService.sign(
        { ...payload, type: 'RefreshToken', sessionId } as any,
        { secret: this.jwtSecret, expiresIn: this.refreshTokenExpiryPeriod  as any },
      ),
      refreshTokenKey: uuid(),
    };
  }

  async register(registerInputDto: RegisterInputDto) {
    const { password, passwordConfirmation, ...rest } = registerInputDto;

    if (password !== passwordConfirmation) {
      throw new BadRequestException(
        'Password confirmation must match password',
      );
    }

    const hashedPassword = await hash(password, this.saltRounds);

    return this.userService.create({
      ...rest,
      username: registerInputDto.email,
      password: hashedPassword,
    });
  }

  validateToken(token: string) {
    try {
      const decoded = verify(token, this.jwtSecret) as JwtPayload;
      return {
        userId: decoded['sub'],
        email: decoded['email'],
        type: decoded['type'],
        sessionId: decoded['sessionId'],
      };
    } catch (e) {
      Logger.log(e);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateUser(loginDto: LoginInputDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (user) {
      const { password, ...result } = loginDto;
      const passwordMatched = await compare(password, user.password ?? '');
      if (passwordMatched) return result;
    }
    return null;
  }

  async verifyEmail(token: string) {
    const storedEmail = (await this.keyvRedis.get(token)) as string;

    if (!storedEmail) {
      throw new BadRequestException('Token is invalid or has expired');
    }
    const user = (await this.userService.findByEmail(storedEmail)) as UserModel;
    user.emailVerifiedAt = new Date();
    await this.keyvRedis.delete(token);
    await user.save();

    return user;
  }

  /**
   * Setup two-factor authentication for a user
   * Generates TOTP secret, QR code, and backup codes
   */
  async setupTwoFactorAuth(userId: number): Promise<TwoFactorSetup> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `FSMS (${user.email})`,
      issuer: 'FSMS',
      length: 32,
    });

    // Generate QR code URL
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    // Store the secret and backup codes (but don't enable 2FA yet)
    user.twoFactorSecret = secret.base32;
    user.twoFactorBackupCodes = JSON.stringify(backupCodes);
    await user.save();

    return {
      secret: secret.base32!,
      qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Enable two-factor authentication after verifying the initial token
   */
  async enableTwoFactorAuth(userId: number, token: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('Two-factor authentication not set up');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps of tolerance
    });

    if (!isValid) {
      throw new BadRequestException('Invalid verification token');
    }

    user.twoFactorEnabled = true;
    await user.save();

    return true;
  }

  /**
   * Disable two-factor authentication
   */
  async disableTwoFactorAuth(userId: number, token: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    if (!user || !user.twoFactorEnabled) {
      throw new BadRequestException('Two-factor authentication not enabled');
    }

    const isValid = await this.verifyTwoFactorToken(user, { token });
    if (!isValid) {
      throw new BadRequestException('Invalid verification token');
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.twoFactorBackupCodes = null;
    await user.save();

    return true;
  }

  /**
   * Verify two-factor authentication token or backup code
   */
  async verifyTwoFactorToken(
    user: UserModel,
    verification: TwoFactorVerification,
  ): Promise<boolean> {
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return false;
    }

    // Try backup code first if provided
    if (verification.backupCode) {
      return this.verifyBackupCode(user, verification.backupCode);
    }

    // Verify TOTP token
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: verification.token,
      window: 2, // Allow 2 time steps of tolerance
    });

    return isValid;
  }

  /**
   * Verify and consume a backup code
   */
  private async verifyBackupCode(user: UserModel, backupCode: string): Promise<boolean> {
    if (!user.twoFactorBackupCodes) {
      return false;
    }

    const backupCodes = JSON.parse(user.twoFactorBackupCodes) as string[];
    const codeIndex = backupCodes.indexOf(backupCode);

    if (codeIndex === -1) {
      return false;
    }

    // Remove the used backup code
    backupCodes.splice(codeIndex, 1);
    user.twoFactorBackupCodes = JSON.stringify(backupCodes);
    await user.save();

    return true;
  }

  /**
   * Generate backup codes for 2FA recovery
   */
  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generate 8-character alphanumeric codes
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Regenerate backup codes for a user
   */
  async regenerateBackupCodes(userId: number, token: string): Promise<string[]> {
    const user = await this.userService.findById(userId);
    if (!user || !user.twoFactorEnabled) {
      throw new BadRequestException('Two-factor authentication not enabled');
    }

    const isValid = await this.verifyTwoFactorToken(user, { token });
    if (!isValid) {
      throw new BadRequestException('Invalid verification token');
    }

    const backupCodes = this.generateBackupCodes();
    user.twoFactorBackupCodes = JSON.stringify(backupCodes);
    await user.save();

    return backupCodes;
  }
}
