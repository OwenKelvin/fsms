import { Module } from '@nestjs/common';

import { MpesaResolver } from './mpesa.resolver';
import { BullModule } from '@nestjs/bull';
import { MPESA_PAYMENT_RECEIVED_QUEUE } from './queue.constants';

import { MpesaController } from './mpesa.controller';
import { PubSubProviderModule } from '@fsms/backend/util';
import { InstitutionBackendServiceModule } from '@fsms/backend/institution-backend-service';
import { MpesaServiceModule } from '@fsms/backend/mpesa-service';
import { AuthServiceBackendModule } from '@fsms/backend/auth-service';
import { TransactionBackendServiceModule } from '@fsms/backend/transaction-backend-service';
import { QuoteBackendServiceModule } from '@fsms/backend/quote-backend-service';
import { CreditBackendServiceModule } from '@fsms/backend/credit-backend-service';

@Module({
  imports: [
    MpesaServiceModule,
    InstitutionBackendServiceModule,
    BullModule.registerQueue({ name: MPESA_PAYMENT_RECEIVED_QUEUE }),
    PubSubProviderModule,
    AuthServiceBackendModule,
    TransactionBackendServiceModule,
    QuoteBackendServiceModule,
    CreditBackendServiceModule,
  ],
  providers: [MpesaResolver],
  controllers: [MpesaController],
  exports: [],
})
export class MpesaModule {}
