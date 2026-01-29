import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { ActivityLogUserModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ActivityLogUserBackendService extends CrudAbstractService<ActivityLogUserModel> {
  constructor(
    @InjectModel(ActivityLogUserModel)
    activityLogUserModel: typeof ActivityLogUserModel,
  ) {
    super(activityLogUserModel);
  }
}
