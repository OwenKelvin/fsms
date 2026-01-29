import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { ConfigModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ConfigBackendService extends CrudAbstractService<ConfigModel> {
  constructor(
    @InjectModel(ConfigModel) private configModel: typeof ConfigModel
  ) {
    super(configModel);
  }
}
