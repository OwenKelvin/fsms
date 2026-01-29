import { Module } from '@nestjs/common';
import { ChoiceModelEventsListener } from './listeners/choice-model-events-listener.service';
import { ChoiceBackendServiceModule } from '@fsms/backend/choice-backend-service';
import { ChoiceResolver } from './resolvers/choice.resolver';

@Module({
  imports: [ChoiceBackendServiceModule],
  providers: [ChoiceResolver, ChoiceModelEventsListener],
  exports: [],
})
export class ChoiceModule {}
