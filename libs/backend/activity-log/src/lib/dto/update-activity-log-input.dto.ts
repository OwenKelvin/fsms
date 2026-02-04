import { IsInt, ValidateNested } from 'class-validator';
import { CreateActivityLogInputDto } from './create-activity-log-input.dto';
import { ActivityLogModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateActivityLogInputDto {
  @IsInt()
  @Exists(ActivityLogModel, 'id', {
    message: (validationArguments) =>
      `ActivityLog with id  ${validationArguments.value}" not found`,
  })
  id = '';

  @ValidateNested()
  params: CreateActivityLogInputDto = { name: '' };
}
