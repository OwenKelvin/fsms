import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { PlanInfoModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PlanInfoBackendService extends CrudAbstractService<PlanInfoModel> {
  constructor(
    @InjectModel(PlanInfoModel) private planInfoModel: typeof PlanInfoModel,
  ) {
    super(planInfoModel);
  }
}
