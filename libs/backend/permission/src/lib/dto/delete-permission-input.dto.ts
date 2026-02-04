import { IsInt } from 'class-validator';
import { PermissionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeletePermissionInputDto {
  @IsInt()
  @Exists(PermissionModel, 'id', {
    message: (validationArguments) =>
      `Permission with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
