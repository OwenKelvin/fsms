import { Module } from '@nestjs/common';
import { ExamineeGroupModelEventsListener } from './listeners/examinee-group-model-events-listener.service';
import { ExamineeGroupBackendServiceModule } from '@fsms/backend/examinee-group-backend-service';
import { ExamineeGroupResolver } from './resolvers/examinee-group.resolver';
import { InstitutionBackendServiceModule } from '@fsms/backend/institution-backend-service';
import { AuthServiceBackendModule } from '@fsms/backend/auth-service';

@Module({
  imports: [
    ExamineeGroupBackendServiceModule,
    InstitutionBackendServiceModule,
    AuthServiceBackendModule,
  ],
  providers: [ExamineeGroupResolver, ExamineeGroupModelEventsListener],
  exports: [],
})
export class ExamineeGroupModule {}
