import { Module } from '@nestjs/common';
import { RoleResolver } from './resolvers/role.resolver';
import { RoleServiceBackendModule } from '@fsms/backend/role-service';
import { RolePermissionAssignmentResolver } from './resolvers/role-permission-assignment.resolver';
import { PermissionServiceBackendModule } from '@fsms/backend/permission-service';
import { UserServiceModule } from '@fsms/backend/user-service';

@Module({
  imports: [
    RoleServiceBackendModule,
    PermissionServiceBackendModule,
    UserServiceModule,
  ],
  providers: [RoleResolver, RolePermissionAssignmentResolver],
})
export class RoleModule {}
