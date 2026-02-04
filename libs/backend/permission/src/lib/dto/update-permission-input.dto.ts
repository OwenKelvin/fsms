import { IsInt, ValidateNested } from 'class-validator';
import { CreatePermissionInputDto } from './create-permission-input.dto';
import { PermissionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdatePermissionInputDto {
  @IsInt()
  @Exists(PermissionModel, 'name', {
    message: (validationArguments) =>
      `User with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreatePermissionInputDto = { name: '' };
}
