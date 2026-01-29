import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { ExamineeModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ExamineeBackendService extends CrudAbstractService<ExamineeModel> {
  constructor(
    @InjectModel(ExamineeModel) private examineeModel: typeof ExamineeModel,
  ) {
    super(examineeModel);
  }
  override globalSearchFields = ['unique_identifier'];
}
