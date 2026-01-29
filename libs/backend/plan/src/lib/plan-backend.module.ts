import { Module } from '@nestjs/common';
import { PlanModelEventsListener } from './listeners/plan-model-events-listener.service';
import { PlanBackendServiceModule } from '@fsms/backend/plan-backend-service';
import { PlanResolver } from './resolvers/plan.resolver';

@Module({
  imports: [PlanBackendServiceModule],
  providers: [PlanResolver, PlanModelEventsListener],
  exports: [],
})
export class PlanModule {}
