import { Module } from '@nestjs/common';
import { InstitutionModelEventsListener } from './listeners/institution-model-events-listener.service';
import { InstitutionBackendServiceModule } from '@fsms/backend/institution-backend-service';
import { InstitutionResolver } from './resolvers/institution.resolver';

@Module({
  imports: [InstitutionBackendServiceModule],
  providers: [InstitutionResolver, InstitutionModelEventsListener],
  exports: [],
})
export class InstitutionModule {}
