import { IsInt, ValidateNested } from 'class-validator';
import { CreateRoleInputDto } from './create-role-input.dto';
import { RoleModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateRoleInputDto {
  @IsInt()
  @Exists(RoleModel, 'name', {
    message: (validationArguments) =>
      `User with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateRoleInputDto = { name: '' };
}
