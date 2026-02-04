import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '@fsms/backend/db';
import { RoleService } from '@fsms/backend/role-service';
import { validateUUID } from '@fsms/backend/util';

@Resolver()
export class UserRolesResolver {
  constructor(private roleService: RoleService) {}

  @Query(() => UserModel)
  async userRoles(@Args('userId') userId: string) {
    validateUUID(userId, 'userId');
    const roles = await this.roleService.getUserRoles(userId);
    return {
      items: roles,
      meta: {
        totalItems: roles.length,
      },
    };
  }
}
