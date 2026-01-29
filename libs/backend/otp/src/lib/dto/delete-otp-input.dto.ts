import { IsInt } from 'class-validator';
import { OtpModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteOtpInputDto {
  @IsInt()
  @Exists(OtpModel, 'id', {
    message: (validationArguments) =>
      `Otp with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
