import { Module } from '@nestjs/common';
import { PermissionResolver } from './resolvers/permission.resolver';
import { PermissionServiceBackendModule } from '@fsms/backend/permission-service';
import { UserServiceModule } from '@fsms/backend/user-service';
import { RoleServiceBackendModule } from '@fsms/backend/role-service';

@Module({
  imports: [
    RoleServiceBackendModule,
    PermissionServiceBackendModule,
    UserServiceModule,
  ],
  providers: [PermissionResolver],
})
export class PermissionModule {}
