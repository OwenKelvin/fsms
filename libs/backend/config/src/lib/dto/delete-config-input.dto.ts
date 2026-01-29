import { IsInt } from 'class-validator';
import { ConfigModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteConfigInputDto {
  @IsInt()
  @Exists(ConfigModel, 'id', {
    message: (validationArguments) =>
      `Config with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
