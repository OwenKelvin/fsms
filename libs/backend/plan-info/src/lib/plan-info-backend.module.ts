import { Module } from '@nestjs/common';
import { PlanInfoModelEventsListener } from './listeners/plan-info-model-events-listener.service';
import { PlanInfoBackendServiceModule } from '@fsms/backend/plan-info-backend-service';
import { PlanInfoResolver } from './resolvers/plan-info.resolver';

@Module({
  imports: [PlanInfoBackendServiceModule],
  providers: [PlanInfoResolver, PlanInfoModelEventsListener],
  exports: [],
})
export class PlanInfoModule {}
