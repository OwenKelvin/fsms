import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { RoleModel, RoleUserModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';
import { validateUUID } from '@fsms/backend/util';

@Injectable()
export class RoleService extends CrudAbstractService<RoleModel> {
  constructor(
    @InjectModel(RoleModel) private roleModel: typeof RoleModel,
    @InjectModel(RoleUserModel) private roleUserModel: typeof RoleUserModel,
  ) {
    super(roleModel);
  }

  async getUserRoles(userId: string) {
    validateUUID(userId, 'userId');
    
    const userRoles = await this.roleUserModel.findAll({
      where: { userId },
      attributes: ['roleId'],
    });

    const roleIds = userRoles.map((ur) => ur.roleId);
    if (roleIds.length > 0) {
      return this.roleModel.findAll({
        where: {
          id: roleIds,
        },
        include: ['permissions'],
      });
    } else {
      return [];
    }
  }

  // Modified assignRole function to accept roleName
  async assignRoleToUser(userId: string, roleName: string): Promise<void> {
    validateUUID(userId, 'userId');
    
    // Find the role by roleName
    const role = await this.roleModel.findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    const roleId = role.id;

    // Check if the role is already assigned to the user
    const existingRole = await this.roleUserModel.findOne({
      where: { userId, roleId },
    });

    if (existingRole) {
      throw new Error('User already has this role');
    }

    // Assign the new role to the user
    await this.roleUserModel.create({
      userId,
      roleId,
    });
  }
}
