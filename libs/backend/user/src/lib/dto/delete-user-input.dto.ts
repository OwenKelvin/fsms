import { IsInt } from 'class-validator';
import { UserModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteUserInputDto {
  @IsInt()
  @Exists(UserModel, 'id', {
    message: (validationArguments) =>
      `User with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
