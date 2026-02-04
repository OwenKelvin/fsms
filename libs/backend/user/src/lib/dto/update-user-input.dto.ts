import { IsInt, ValidateNested } from 'class-validator';
import { CreateUserInputDto } from './create-user-input.dto';
import { UserModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateUserInputDto {
  @IsInt()
  @Exists(UserModel, 'id', {
    message: (validationArguments) =>
      `User with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateUserInputDto = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  };
}
