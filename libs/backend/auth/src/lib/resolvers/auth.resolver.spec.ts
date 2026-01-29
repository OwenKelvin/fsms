import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthServiceBackend } from '@fsms/backend/auth-service';
import { UserService } from '@fsms/backend/user-service';
import { OtpBackendService } from '@fsms/backend/otp-backend-service';
import { TranslationService } from '@fsms/backend/translation';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetBackendService } from '@fsms/backend/password-reset-backend-service';
import { PUB_SUB } from '@fsms/backend/util';

const authServiceMock = {
  signInGoogleUser: jest.fn(),
  login: jest.fn(),
};

const otpServiceMock = {};

const translationServiceMock = {};

const pubSubMock = {};

const userServiceMock = {};

const jwtServiceMock = {};

const sendPasswordResetOtp = {};

const passwordResetServiceMock = {};
const eventEmitterMock = {
  emit: jest.fn(),
};
describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthServiceBackend;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthServiceBackend,
          useValue: authServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: OtpBackendService,
          useValue: otpServiceMock,
        },
        {
          provide: TranslationService,
          useValue: translationServiceMock,
        },
        {
          provide: PUB_SUB,
          useValue: pubSubMock,
        },
        {
          provide: 'BullQueue_send-password-reset-otp',
          useValue: sendPasswordResetOtp,
        },
        {
          provide: 'BullQueue_send-password-reset-link',
          useValue: sendPasswordResetOtp,
        },
        {
          provide: 'BullQueue_send-verification-link',
          useValue: sendPasswordResetOtp,
        },
        {
          provide: EventEmitter2,
          useValue: eventEmitterMock,
        },
        {
          provide: PasswordResetBackendService,
          useValue: passwordResetServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthServiceBackend>(AuthServiceBackend);
  });

  it('should sign in with Google and return user', async () => {
    const user = { id: '1', name: 'John Doe' };
    const token = 'some_google_token';

    authServiceMock.signInGoogleUser.mockResolvedValueOnce(user);
    authServiceMock.login.mockReturnValueOnce('some_auth_token');

    const result = await resolver.signInWithGoogle(token);

    expect(authService.signInGoogleUser).toHaveBeenCalledWith(token);
    expect(authService.login).toHaveBeenCalledWith(user);
    expect(result).toEqual('some_auth_token');
  });

  it('should return null if user is not found', async () => {
    const token = 'some_google_token';

    authServiceMock.signInGoogleUser.mockResolvedValueOnce(null);

    const result = await resolver.signInWithGoogle(token);

    expect(authService.signInGoogleUser).toHaveBeenCalledWith(token);
    expect(result).toBeNull();
  });
});
