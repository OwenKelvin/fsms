import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserModel } from '@fsms/backend/db';
import { RoleService } from '@fsms/backend/role-service';

@Resolver()
export class UserRolesResolver {

  constructor(private roleService: RoleService) {
  }

  @Query(() => UserModel)
  async userRoles(
    @Args('userId') userId: number
  ) {
    const roles = await this.roleService.getUserRoles(userId);
    return {
      items: roles,
      meta: {
        totalItems: roles.length
      }
    }
  }
}
