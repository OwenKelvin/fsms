import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { PermissionModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PermissionService extends CrudAbstractService<PermissionModel> {
  constructor(
    @InjectModel(PermissionModel) repository: typeof PermissionModel,
  ) {
    super(repository);
  }
}
