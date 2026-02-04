import { Mutation, Resolver } from '@nestjs/graphql';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
  PermissionService,
} from '@fsms/backend/permission-service';
import { RoleService } from '@fsms/backend/role-service';
import { GivePermissionToRoleInputDto } from '../dto/give-permission-to-role-input.dto';
import { PermissionModel, RoleModel, UserModel } from '@fsms/backend/db';
import { AssignRoleToUserInputDto } from '../dto/assign-role-to-user-input.dto';
import { UserService } from '@fsms/backend/user-service';
import { validateUUID } from '@fsms/backend/util';

@Resolver(() => RoleModel)
export class RolePermissionAssignmentResolver {
  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private userService: UserService,
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.GivePermissionToRole)
  async givePermissionsToRole(
    @Body(new ValidationPipe()) input: GivePermissionToRoleInputDto,
  ) {
    validateUUID(input.roleId, 'roleId');
    const role = (await this.roleService.findById(input.roleId)) as RoleModel;
    await role.$set('permissions', []);
    for (let i = 0; i < input.permissions.length; i++) {
      const permissionId = input.permissions[i].id;
      validateUUID(permissionId, 'permissionId');
      const permission = (await this.permissionService.findById(
        permissionId,
      )) as PermissionModel;
      await role.$add('permissions', permission);
    }

    return {
      message: 'Successfully given permissions to role',
      data: role,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.AssignRoleToUser)
  async assignRoleToUser(
    @Body(new ValidationPipe()) input: AssignRoleToUserInputDto,
  ) {
    validateUUID(input.userId, 'userId');
    const user = (await this.userService.findById(input.userId)) as UserModel;
    await user.$set('roles', []);
    for (let i = 0; i < input.roles.length; i++) {
      const roleId = input.roles[i].id;
      validateUUID(roleId, 'roleId');
      const role = (await this.roleService.findById(roleId)) as RoleModel;
      await user.$add('roles', role);
    }

    return {
      message: 'Successfully assigned role to user',
    };
  }
}
