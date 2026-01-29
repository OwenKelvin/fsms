import { IsInt, ValidateNested } from 'class-validator';
import { CreatePasswordResetInputDto } from './create-password-reset-input.dto';
import { PasswordResetModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdatePasswordResetInputDto {
  @IsInt()
  @Exists(PasswordResetModel, 'id', {
    message: (validationArguments) =>
      `PasswordReset with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreatePasswordResetInputDto = { name: '' };
}
