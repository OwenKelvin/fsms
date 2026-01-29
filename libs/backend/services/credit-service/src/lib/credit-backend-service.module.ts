import { Module } from '@nestjs/common';
import { CreditBackendService } from './services/credit-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreditModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([CreditModel])],
  providers: [CreditBackendService],
  exports: [CreditBackendService],
})
export class CreditBackendServiceModule {}
