import { IsInt, ValidateNested } from 'class-validator';
import { CreateNotificationInputDto } from './create-notification-input.dto';
import { NotificationModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateNotificationInputDto {
  @IsInt()
  @Exists(NotificationModel, 'id', {
    message: (validationArguments) =>
      `Notification with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateNotificationInputDto = { description: '', title: '' };
}
