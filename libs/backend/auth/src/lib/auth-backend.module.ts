import { Module } from '@nestjs/common';
import { AuthResolver } from './resolvers/auth.resolver';
import {
  AuthServiceBackendModule,
  JwtAuthModule,
} from '@fsms/backend/auth-service';
import { UserServiceModule } from '@fsms/backend/user-service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermissionServiceBackendModule } from '@fsms/backend/permission-service';
import { LocalStrategy } from './strategies/local.strategy';
import { OtpBackendServiceModule } from '@fsms/backend/otp-backend-service';
import { TranslationServiceModule } from '@fsms/backend/translation';
import { PubSubProviderModule } from '@fsms/backend/util';
import { SendPasswordResetLinkConsumer } from './consumers/send-password-reset-link.consumer';
import {
  SEND_PASSWORD_RESET_LINK_QUEUE,
  SEND_PASSWORD_RESET_OTP_QUEUE,
  SEND_VERIFICATION_LINK_QUEUE,
  SEND_WELCOME_EMAIL_QUEUE,
} from './constants/queue.constants';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from '@fsms/backend/email-service';
import { AuthEventsListenerService } from './listeners/auth-events-listener.service';
import { RoleServiceBackendModule } from '@fsms/backend/role-service';
import { PasswordResetBackendServiceModule } from '@fsms/backend/password-reset-backend-service';
import { SendEmailVerificationLinkConsumer } from './consumers/send-email-verification-link.consumer';
import { InstitutionBackendServiceModule } from '@fsms/backend/institution-backend-service';
import { SendWelcomeEmailConsumer } from './consumers/send-welcome-email.consumer';
import { SettingBackendServiceModule } from '@fsms/backend/setting-backend-service';

@Module({
  imports: [
    AuthServiceBackendModule,
    JwtAuthModule,
    BullModule.registerQueue(
      { name: SEND_PASSWORD_RESET_OTP_QUEUE },
      { name: SEND_PASSWORD_RESET_LINK_QUEUE },
      { name: SEND_VERIFICATION_LINK_QUEUE },
      { name: SEND_WELCOME_EMAIL_QUEUE },
    ),
    UserServiceModule,
    PermissionServiceBackendModule,
    OtpBackendServiceModule,
    TranslationServiceModule,
    PubSubProviderModule,
    EmailModule,
    RoleServiceBackendModule,
    PasswordResetBackendServiceModule,
    InstitutionBackendServiceModule,
    SettingBackendServiceModule,
  ],
  providers: [
    AuthResolver,
    JwtStrategy,
    LocalStrategy,
    SendPasswordResetLinkConsumer,
    SendEmailVerificationLinkConsumer,
    SendWelcomeEmailConsumer,
    AuthEventsListenerService,
  ],
  exports: [],
})
export class AuthBackendModule {}
