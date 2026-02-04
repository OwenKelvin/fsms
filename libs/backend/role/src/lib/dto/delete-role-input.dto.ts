import { IsInt } from 'class-validator';
import { RoleModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteRoleInputDto {
  @IsInt()
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
