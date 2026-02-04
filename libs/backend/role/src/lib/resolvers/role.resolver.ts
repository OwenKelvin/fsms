import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateRoleInputDto } from '../dto/create-role-input.dto';
import { Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { RoleService } from '@fsms/backend/role-service';
import { IQueryParam, PermissionModel, RoleModel } from '@fsms/backend/db';
import { validateUUID } from '@fsms/backend/util';

@Resolver(() => RoleModel)
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateRole)
  async createRole(@Body(new ValidationPipe()) input: CreateRoleInputDto) {
    const role = await this.roleService.create({
      ...input,
    });
    return {
      message: 'Successfully created role',
      data: role,
    };
  }

  @Query(() => RoleModel)
  roles(@Args('query') query: IQueryParam) {
    return this.roleService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => RoleModel)
  async role(@Args('id') id: string) {
    validateUUID(id, 'id');
    return this.roleService.findById(id);
  }

  @ResolveField()
  async permissions(@Parent() roleModel: RoleModel) {
    validateUUID(roleModel.id, 'roleId');
    const rolePermissions = await this.roleService.findById(roleModel.id, {
      include: [PermissionModel],
    });
    return rolePermissions ? rolePermissions.permissions : [];
  }

  @Mutation(() => RoleModel)
  async deleteRole(@Args('id') id: string) {
    validateUUID(id, 'id');
    await this.roleService.deleteById(id);

    return {
      message: 'Successfully deleted role',
    };
  }
}
