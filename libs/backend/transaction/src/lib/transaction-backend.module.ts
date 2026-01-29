import { Module } from '@nestjs/common';
import { TransactionModelEventsListener } from './listeners/transaction-model-events-listener.service';
import { TransactionBackendServiceModule } from '@fsms/backend/transaction-backend-service';
import { TransactionResolver } from './resolvers/transaction.resolver';

@Module({
  imports: [TransactionBackendServiceModule],
  providers: [TransactionResolver, TransactionModelEventsListener],
  exports: [],
})
export class TransactionModule {}
