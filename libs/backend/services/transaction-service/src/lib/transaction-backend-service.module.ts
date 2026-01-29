import { Module } from '@nestjs/common';
import { TransactionBackendService } from './services/transaction-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([TransactionModel])],
  providers: [TransactionBackendService],
  exports: [TransactionBackendService],
})
export class TransactionBackendServiceModule {}
