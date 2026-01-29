import { IsNotEmpty } from 'class-validator';
import { IsPhoneNumberOrEmail } from '@fsms/backend/validators';


export class ValidateOtpInputDto {

  @IsNotEmpty()
  @IsPhoneNumberOrEmail({ message: 'Identifier must be a valid email or phone number' })
  identifier = '';

  @IsNotEmpty()
  token = '';
}
