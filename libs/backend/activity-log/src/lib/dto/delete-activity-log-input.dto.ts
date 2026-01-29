import { IsInt } from 'class-validator';
import { ActivityLogModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteActivityLogInputDto {
  @IsInt()
  @Exists(ActivityLogModel, 'id', {
    message: (validationArguments) =>
      `ActivityLog with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
