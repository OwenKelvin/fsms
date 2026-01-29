import { Module } from '@nestjs/common';
import { TagModelEventsListener } from './listeners/tag-model-events-listener.service';
import { TagBackendServiceModule } from '@fsms/backend/tag-backend-service';
import { TagResolver } from './resolvers/tag.resolver';
import { InstitutionBackendServiceModule } from '@fsms/backend/institution-backend-service';
import { UserServiceModule } from '@fsms/backend/user-service';
import { AuthServiceBackendModule } from '@fsms/backend/auth-service';

@Module({
  imports: [
    TagBackendServiceModule,
    InstitutionBackendServiceModule,
    UserServiceModule,
    AuthServiceBackendModule,
  ],
  providers: [TagResolver, TagModelEventsListener],
  exports: [],
})
export class TagModule {}
