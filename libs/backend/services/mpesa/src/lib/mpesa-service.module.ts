import { Module } from '@nestjs/common';
import { MpesaStkRequestService } from './mpesa-stk-request.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { MpesaStkRequestModel } from '@fsms/backend/db';
import { MpesaService } from './mpesa.service';
import { QuoteBackendServiceModule } from '@fsms/backend/quote-backend-service';

@Module({
  imports: [
    SequelizeModule.forFeature([MpesaStkRequestModel]),
    QuoteBackendServiceModule,
  ],
  providers: [MpesaStkRequestService, MpesaService],
  exports: [MpesaStkRequestService, MpesaService],
})
export class MpesaServiceModule {}
