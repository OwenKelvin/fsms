import { Module } from '@nestjs/common';
import { QuoteModelEventsListener } from './listeners/quote-model-events-listener.service';
import { QuoteBackendServiceModule } from '@fsms/backend/quote-backend-service';
import { QuoteResolver } from './resolvers/quote.resolver';
import { PlanBackendServiceModule } from '@fsms/backend/plan-backend-service';
import { InstitutionBackendServiceModule } from '@fsms/backend/institution-backend-service';
import { AuthServiceBackendModule } from '@fsms/backend/auth-service';

@Module({
  imports: [
    QuoteBackendServiceModule,
    PlanBackendServiceModule,
    InstitutionBackendServiceModule,
    AuthServiceBackendModule,
  ],
  providers: [QuoteResolver, QuoteModelEventsListener],
  exports: [],
})
export class QuoteModule {}
