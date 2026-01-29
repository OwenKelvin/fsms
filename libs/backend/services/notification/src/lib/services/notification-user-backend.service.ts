import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { NotificationUserModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class NotificationUserBackendService extends CrudAbstractService<NotificationUserModel> {
  constructor(
    @InjectModel(NotificationUserModel)
    private notificationUserModel: typeof NotificationUserModel,
  ) {
    super(notificationUserModel);
  }
}
