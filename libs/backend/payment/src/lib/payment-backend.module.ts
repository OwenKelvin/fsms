import { Module } from '@nestjs/common';
import { PaymentModelEventsListener } from './listeners/payment-model-events-listener.service';
import { PaymentBackendServiceModule } from '@fsms/backend/payment-backend-service';
import { PaymentResolver } from './resolvers/payment.resolver';

@Module({
  imports: [PaymentBackendServiceModule],
  providers: [PaymentResolver, PaymentModelEventsListener],
  exports: [],
})
export class PaymentModule {}
