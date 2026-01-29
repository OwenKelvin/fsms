import { Module } from '@nestjs/common';
import { ExamineeModelEventsListener } from './listeners/examinee-model-events-listener.service';
import { ExamineeBackendServiceModule } from '@fsms/backend/examinee-backend-service';
import { ExamineeResolver } from './resolvers/examinee.resolver';

@Module({
  imports: [ExamineeBackendServiceModule],
  providers: [ExamineeResolver, ExamineeModelEventsListener],
  exports: [],
})
export class ExamineeModule {}
