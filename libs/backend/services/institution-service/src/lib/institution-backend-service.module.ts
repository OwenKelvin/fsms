import { Module } from '@nestjs/common';
import { InstitutionBackendService } from './services/institution-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InstitutionModel, InstitutionUserModel } from '@fsms/backend/db';
import { SettingBackendServiceModule } from '@fsms/backend/setting-backend-service';
import { TranslationServiceModule } from '@fsms/backend/translation';
import { CreditBackendServiceModule } from '@fsms/backend/credit-backend-service';
import { TransactionBackendServiceModule } from '@fsms/backend/transaction-backend-service';

@Module({
  imports: [
    SequelizeModule.forFeature([InstitutionModel, InstitutionUserModel]),
    SettingBackendServiceModule,
    TranslationServiceModule,
    CreditBackendServiceModule,
    TransactionBackendServiceModule,
  ],
  providers: [InstitutionBackendService],
  exports: [InstitutionBackendService],
})
export class InstitutionBackendServiceModule {}
