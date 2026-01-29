import { Module } from '@nestjs/common';
import { PaymentBackendService } from './services/payment-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([PaymentModel])],
  providers: [PaymentBackendService],
  exports: [PaymentBackendService],
})
export class PaymentBackendServiceModule {}
