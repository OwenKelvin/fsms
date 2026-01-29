import { IsInt, ValidateNested } from 'class-validator';
import { CreateSettingInputDto } from './create-setting-input.dto';
import { SettingModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateSettingInputDto {
  @IsInt()
  @Exists(SettingModel, 'id', {
    message: (validationArguments) =>
      `Setting with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateSettingInputDto = { name: '' };
}
