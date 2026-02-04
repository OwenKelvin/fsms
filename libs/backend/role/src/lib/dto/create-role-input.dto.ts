import { IsNotEmpty } from 'class-validator';
import { RoleModel } from '@fsms/backend/db';
import { DoesntExist } from '@fsms/backend/validators';

export class CreateRoleInputDto {
  @IsNotEmpty()
  @DoesntExist(
    RoleModel,
    'name',
    { isAdmin: false },
    { message: 'Role already exists' },
  )
  name = '';
}
