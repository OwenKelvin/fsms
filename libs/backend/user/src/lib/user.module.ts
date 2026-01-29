import { Module } from '@nestjs/common';
import { UserResolver } from './resolvers/user.resolver';
import { UserServiceModule } from '@fsms/backend/user-service';
import { UserModelEventsListener } from './listerners/user-model-events-listener.service';
import { EmailModule } from '@fsms/backend/email-service';
import { RoleServiceBackendModule } from '@fsms/backend/role-service';
import { UserRolesResolver } from './resolvers/user-roles.resolver';
import { InstitutionBackendServiceModule } from '@fsms/backend/institution-backend-service';

@Module({
  imports: [
    UserServiceModule,
    RoleServiceBackendModule,
    InstitutionBackendServiceModule,
    EmailModule,
  ],
  providers: [UserResolver, UserRolesResolver, UserModelEventsListener],
  exports: [],
})
export class UserModule {}
