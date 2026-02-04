import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { RoleModel, UserModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';
import { Type } from 'class-transformer';

class RoleDto {
  @Exists(RoleModel, 'id', {
    message: (validationArguments) =>
      `Role with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}

export class AssignRoleToUserInputDto {
  @IsInt()
  @IsNotEmpty()
  @Exists(UserModel, 'id', {
    message: (validationArguments) =>
      `User with id  ${validationArguments.value}" not found`,
  })
  userId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  roles: RoleDto[] = [];
}
