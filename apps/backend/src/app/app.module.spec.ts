import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { UserModule } from '@fsms/backend/user';
import { RoleModule } from '@fsms/backend/role';
import { TagModule } from '@fsms/backend/tag-backend';
import { AppQueueModule } from '@fsms/backend/app-queue';
import { TranslationModule } from '@fsms/backend/translation';
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
import { CreditModule } from '@fsms/backend/credit-backend';
import { TransactionModule } from '@fsms/backend/transaction-backend';
import { MpesaModule } from '@fsms/backend/mpesa';
import { PlanModule } from '@fsms/backend/plan-backend';
import { PlanInfoModule } from '@fsms/backend/plan-info-backend';
import { QuoteModule } from '@fsms/backend/quote-backend';
import { PaymentModule } from '@fsms/backend/payment-backend';
import { ActivityLogModule } from '@fsms/backend/activity-log-backend';
jest.mock('@fsms/backend/db', () => ({
  DbModule: class DbModuleMock {},
}));
jest.mock('@fsms/backend/user', () => ({
  UserModule: class UserModuleMock {},
}));
jest.mock('@fsms/backend/auth', () => ({
  AuthBackendModule: class AuthBackendModuleMock {},
}));
jest.mock('@fsms/backend/app-event', () => ({
  AppEventModule: class AppEventModule {},
}));
jest.mock('@fsms/backend/app-queue', () => ({
  AppQueueModule: class AppQueueModule {},
}));
jest.mock('@fsms/backend/role', () => ({
  RoleModule: class RoleModuleMock {},
}));
jest.mock('@fsms/backend/permission', () => ({
  PermissionModule: class PermissionModuleMock {},
}));
jest.mock('@fsms/backend/exam', () => ({
  ExamModule: class ExamModuleMock {},
}));
jest.mock('@fsms/backend/tag-backend', () => ({
  TagModule: class TagModuleMock {},
}));
jest.mock('@fsms/backend/translation', () => ({
  TranslationModule: class TranslationModuleMock {},
}));
jest.mock('@fsms/backend/otp-backend', () => ({
  OtpModule: class OtpModuleMock {},
}));
jest.mock('@fsms/backend/password-reset-backend', () => ({
  PasswordResetModule: class PasswordResetModuleMock {},
}));
jest.mock('@fsms/backend/config-backend', () => ({
  ConfigModule: class ConfigModuleMock {},
}));
jest.mock('@fsms/backend/exam-paper-backend', () => ({
  ExamPaperModule: class ExamPaperModuleMock {},
}));
jest.mock('@fsms/backend/question-backend', () => ({
  QuestionModule: class QuestionModuleMock {},
}));
jest.mock('@fsms/backend/choice-backend', () => ({
  ChoiceModule: class ChoiceModuleMock {},
}));
jest.mock('@fsms/backend/instruction-backend', () => ({
  InstructionModule: class InstructionModuleMock {},
}));
jest.mock('@fsms/backend/notification-backend', () => ({
  NotificationModule: class NotificationModuleMock {},
}));
jest.mock('@fsms/backend/examinee-group-backend', () => ({
  ExamineeGroupModule: class ExamineeGroupModuleMock {},
}));
jest.mock('@fsms/backend/examinee-backend', () => ({
  ExamineeModule: class ExamineeModuleMock {},
}));
jest.mock('@fsms/backend/institution-backend', () => ({
  InstitutionModule: class InstitutionModuleMock {},
}));
jest.mock('@fsms/backend/cache', () => ({
  KeyvRedisModule: class AppCacheMock {},
}));
jest.mock('@fsms/backend/file-upload', () => ({
  FileUploadModule: class FileUploadModuleMock {},
}));
jest.mock('@fsms/backend/setting-backend', () => ({
  SettingModule: class SettingModuleMock {},
}));
jest.mock('@fsms/backend/credit-backend', () => ({
  CreditModule: class CreditModuleMock {},
}));
jest.mock('@fsms/backend/transaction-backend', () => ({
  TransactionModule: class TransactionModuleMock {},
}));
jest.mock('@fsms/backend/mpesa', () => ({
  MpesaModule: class MpesaModuleMock {},
}));
jest.mock('@fsms/backend/plan-backend', () => ({
  PlanModule: class PlanModuleMock {},
}));
jest.mock('@fsms/backend/plan-info-backend', () => ({
  PlanInfoModule: class PlanInfoModuleMock {},
}));
jest.mock('@fsms/backend/quote-backend', () => ({
  QuoteModule: class QuoteModuleMock {},
}));
jest.mock('@fsms/backend/payment-backend', () => ({
  PaymentModule: class PaymentModuleMock {},
}));
jest.mock('@fsms/backend/activity-log-backend', () => ({
  ActivityLogModule: class ActivityLogModuleMock {},
}));
describe('AppModule', () => {
  let app: TestingModule;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });
  it('should be defined', () => {
    expect(app).toBeDefined();
  });
  it('should inject UserModule', () => {
    const userModule = app.get<UserModule>(UserModule);
    expect(userModule).toBeDefined();
  });
  it('should inject RoleModule', () => {
    const roleModule = app.get<RoleModule>(RoleModule);
    expect(roleModule).toBeDefined();
  });
  it('should inject TagModule', () => {
    const tagModule = app.get<TagModule>(TagModule);
    expect(tagModule).toBeDefined();
  });
  it('should inject AppQueueModule', () => {
    const appQueueModule = app.get<AppQueueModule>(AppQueueModule);
    expect(appQueueModule).toBeDefined();
  });
  it('should inject TranslationModule', () => {
    const appTranslationModule = app.get<TranslationModule>(TranslationModule);
    expect(appTranslationModule).toBeDefined();
  });
  it('should inject OtpModule', () => {
    const otpModule = app.get<OtpModule>(OtpModule);
    expect(otpModule).toBeDefined();
  });
  it('should inject PasswordResetModule', () => {
    const passwordResetModule =
      app.get<PasswordResetModule>(PasswordResetModule);
    expect(passwordResetModule).toBeDefined();
  });
  it('should inject ConfigModule', () => {
    const configModule = app.get<ConfigModule>(ConfigModule);
    expect(configModule).toBeDefined();
  });
  it('should inject ExamPaperModule', () => {
    const examPaperModule = app.get<ExamPaperModule>(ExamPaperModule);
    expect(examPaperModule).toBeDefined();
  });
  it('should inject QuestionModule', () => {
    const questionModule = app.get<QuestionModule>(QuestionModule);
    expect(questionModule).toBeDefined();
  });
  it('should inject ChoiceModule', () => {
    const choiceModule = app.get<ChoiceModule>(ChoiceModule);
    expect(choiceModule).toBeDefined();
  });
  it('should inject InstructionModule', () => {
    const instructionModule = app.get<InstructionModule>(InstructionModule);
    expect(instructionModule).toBeDefined();
  });
  it('should inject NotificationModule', () => {
    const notificationModule = app.get<NotificationModule>(NotificationModule);
    expect(notificationModule).toBeDefined();
  });
  it('should inject ExamineeGroupModule', () => {
    const examineeGroupModule =
      app.get<ExamineeGroupModule>(ExamineeGroupModule);
    expect(examineeGroupModule).toBeDefined();
  });
  it('should inject ExamineeModule', () => {
    const examineeModule = app.get<ExamineeModule>(ExamineeModule);
    expect(examineeModule).toBeDefined();
  });
  it('should inject InstitutionModule', () => {
    const institutionModule = app.get<InstitutionModule>(InstitutionModule);
    expect(institutionModule).toBeDefined();
  });
  it('should inject KeyvRedisModule', () => {
    const keyvRedisModule = app.get<KeyvRedisModule>(KeyvRedisModule);
    expect(keyvRedisModule).toBeDefined();
  });
  it('should inject FileUploadModule', () => {
    const fileUploadModule = app.get<FileUploadModule>(FileUploadModule);
    expect(fileUploadModule).toBeDefined();
  });
  it('should inject SettingModule', () => {
    const settingModule = app.get<SettingModule>(SettingModule);
    expect(settingModule).toBeDefined();
  });
  it('should inject CreditModule', () => {
    const creditModule = app.get<CreditModule>(CreditModule);
    expect(creditModule).toBeDefined();
  });
  it('should inject TransactionModule', () => {
    const transactionModule = app.get<TransactionModule>(TransactionModule);
    expect(transactionModule).toBeDefined();
  });
  it('should inject MpesaModule', () => {
    const mpesaModule = app.get<MpesaModule>(MpesaModule);
    expect(mpesaModule).toBeDefined();
  });
  it('should inject PlanModule', () => {
    const planModule = app.get<PlanModule>(PlanModule);
    expect(planModule).toBeDefined();
  });
  it('should inject PlanInfoModule', () => {
    const planInfoModule = app.get<PlanInfoModule>(PlanInfoModule);
    expect(planInfoModule).toBeDefined();
  });
  it('should inject QuoteModule', () => {
    const quoteModule = app.get<QuoteModule>(QuoteModule);
    expect(quoteModule).toBeDefined();
  });
  it('should inject PaymentModule', () => {
    const paymentModule = app.get<PaymentModule>(PaymentModule);
    expect(paymentModule).toBeDefined();
  });
  it('should inject ActivityLogModule', () => {
    const activityLogModule = app.get<ActivityLogModule>(ActivityLogModule);
    expect(activityLogModule).toBeDefined();
  });
});
