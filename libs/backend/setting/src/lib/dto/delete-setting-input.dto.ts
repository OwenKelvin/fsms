import { IsInt } from 'class-validator';
import { SettingModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteSettingInputDto {
  @IsInt()
  @Exists(SettingModel, 'id', {
    message: (validationArguments) =>
      `Setting with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
