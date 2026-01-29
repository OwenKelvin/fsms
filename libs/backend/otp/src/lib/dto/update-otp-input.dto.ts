import { IsInt, ValidateNested } from 'class-validator';
import { CreateOtpInputDto } from './create-otp-input.dto';
import { OtpModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateOtpInputDto {
  @IsInt()
  @Exists(OtpModel, 'id', {
    message: (validationArguments) =>
      `Otp with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateOtpInputDto = { name: '' };
}
