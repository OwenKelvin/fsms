import { IsInt, ValidateNested } from 'class-validator';
import { CreateConfigInputDto } from './create-config-input.dto';
import { ConfigModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateConfigInputDto {
  @IsInt()
  @Exists(ConfigModel, 'id', {
    message: (validationArguments) =>
      `Config with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateConfigInputDto = { name: '' };
}
