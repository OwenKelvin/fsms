import { IsArray, ValidateNested } from 'class-validator';
import { NotificationModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';
import { Type } from 'class-transformer';

class NotificationSelectedInputDto {
  @Exists(NotificationModel, 'id', {
    message: (validationArguments) =>
      `Notification with id  ${validationArguments.value}" not found`,
  })
  id = '';
}

export class MarkAsReadNotificationInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationSelectedInputDto)
  notifications: NotificationSelectedInputDto[] = [];
}
