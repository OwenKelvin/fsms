import { IsNotEmpty } from 'class-validator';
import { PermissionModel } from '@fsms/backend/db';
import { DoesntExist } from '@fsms/backend/validators';

export class CreatePermissionInputDto {
  @IsNotEmpty()
  @DoesntExist(PermissionModel, 'name', { message: 'Permission already exists' })
  name = '';

}
