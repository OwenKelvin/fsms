import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleModel, RoleUserModel } from '@fsms/backend/db';

@Module({
  imports: [
    SequelizeModule.forFeature([RoleModel, RoleUserModel])
  ],
  providers: [
    RoleService
  ],
  exports: [
    RoleService
  ],
})
export class RoleServiceBackendModule {}
