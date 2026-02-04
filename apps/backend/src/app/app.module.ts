import { Module } from '@nestjs/common';
import { DbModule } from '@fsms/backend/db';
import { GraphqlModule } from '@fsms/backend/graphql';
import { TranslationModule } from '@fsms/backend/translation';
import { RoleModule } from '@fsms/backend/role';
import { AuthBackendModule } from '@fsms/backend/auth';
import { PermissionModule } from '@fsms/backend/permission';
import { UserModule } from '@fsms/backend/user';
import { ExamModule } from '@fsms/backend/exam';
import { TagModule } from '@fsms/backend/tag-backend';
import { AppEventModule } from '@fsms/backend/app-event';
import { AppQueueModule } from '@fsms/backend/app-queue';
import { OtpModule } from '@fsms/backend/otp-backend';
import { PasswordResetModule } from '@fsms/backend/password-reset-backend';
import { ConfigModule } from '@fsms/backend/config-backend';
import { ExamPaperModule } from '@fsms/backend/exam-paper-backend';
import { QuestionModule } from '@fsms/backend/question-backend';
import { ChoiceModule } from '@fsms/backend/choice-backend';
import { InstructionModule } from '@fsms/backend/instruction-backend';
import { NotificationModule } from '@fsms/backend/notification-backend';
import { ExamineeGroupModule } from '@fsms/backend/examinee-group-backend';
import { ExamineeModule } from '@fsms/backend/examinee-backend';
import { InstitutionModule } from '@fsms/backend/institution-backend';
import { KeyvRedisModule } from '@fsms/backend/cache';
import { FileUploadModule } from '@fsms/backend/file-upload';
import { SettingModule } from '@fsms/backend/setting-backend';
import { MpesaModule } from '@fsms/backend/mpesa';
import { CreditModule } from '@fsms/backend/credit-backend';
import { TransactionModule } from '@fsms/backend/transaction-backend';
import { PlanModule } from '@fsms/backend/plan-backend';
import { PlanInfoModule } from '@fsms/backend/plan-info-backend';
import { QuoteModule } from '@fsms/backend/quote-backend';
import { PaymentModule } from '@fsms/backend/payment-backend';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ActivityLogModule } from '@fsms/backend/activity-log-backend';
import { ActivityLogBackendServiceModule } from '@fsms/backend/activity-log-backend-service';
import { RegistrationModule } from '@fsms/backend/registration-backend';

@Module({
  imports: [
    NestConfigModule.forRoot({ isGlobal: true }),
    KeyvRedisModule,
    GraphqlModule,
    TranslationModule,
    DbModule,
    ActivityLogModule,
    PaymentModule,
    QuoteModule,
    PlanInfoModule,
    PlanModule,
    TransactionModule,
    CreditModule,
    SettingModule,
    InstitutionModule,
    ExamineeModule,
    ExamineeGroupModule,
    ChoiceModule,
    QuestionModule,
    InstructionModule,
    NotificationModule,
    ExamPaperModule,
    ConfigModule,
    PasswordResetModule,
    OtpModule,
    TagModule,
    RoleModule,
    AuthBackendModule,
    PermissionModule,
    UserModule,
    ExamModule,
    AppEventModule,
    AppQueueModule,
    FileUploadModule,
    MpesaModule,
    ActivityLogBackendServiceModule,
    RegistrationModule,
  ],
  providers: [],
})
export class AppModule {}
