import { IsInt } from 'class-validator';
import { PasswordResetModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeletePasswordResetInputDto {
  @IsInt()
  @Exists(PasswordResetModel, 'id', {
    message: (validationArguments) =>
      `PasswordReset with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
