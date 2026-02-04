import { IsUUID, ValidateNested } from 'class-validator';
import { CreateUserInputDto } from './create-user-input.dto';
import { UserModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateUserInputDto {
  @IsUUID(4, { message: 'id must be a valid UUID v4' })
  @Exists(UserModel, 'id', {
    message: (validationArguments) =>
      `User with id  ${validationArguments.value}" not found`,
  })
  id = '';

  @ValidateNested()
  params: CreateUserInputDto = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  };
}
