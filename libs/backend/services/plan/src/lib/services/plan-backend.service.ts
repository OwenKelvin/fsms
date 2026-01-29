import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { PlanModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PlanBackendService extends CrudAbstractService<PlanModel> {
  constructor(@InjectModel(PlanModel) private planModel: typeof PlanModel) {
    super(planModel);
  }
}
