import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { ActivityLogModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ActivityLogBackendService extends CrudAbstractService<ActivityLogModel> {
  constructor(
    @InjectModel(ActivityLogModel)
    private activityLogModel: typeof ActivityLogModel,
  ) {
    super(activityLogModel);
  }
}
