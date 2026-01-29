import { Module } from '@nestjs/common';
import { CreditModelEventsListener } from './listeners/credit-model-events-listener.service';
import { CreditBackendServiceModule } from '@fsms/backend/credit-backend-service';
import { CreditResolver } from './resolvers/credit.resolver';

@Module({
  imports: [CreditBackendServiceModule],
  providers: [CreditResolver, CreditModelEventsListener],
  exports: [],
})
export class CreditModule {}
