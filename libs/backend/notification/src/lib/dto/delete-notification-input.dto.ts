import { IsInt } from 'class-validator';
import { NotificationModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteNotificationInputDto {
  @IsInt()
  @Exists(NotificationModel, 'id', {
    message: (validationArguments) =>
      `Notification with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
