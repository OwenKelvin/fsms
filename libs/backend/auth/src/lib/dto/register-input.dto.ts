import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { DoesntExist } from '@fsms/backend/validators';
import { UserModel } from '@fsms/backend/db';

export class RegisterInputDto {
  @IsString()
  @IsNotEmpty()
  firstName = '';

  @IsString()
  @IsNotEmpty()
  lastName = '';

  @IsNotEmpty()
  password = '';

  @IsNotEmpty()
  passwordConfirmation = '';

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @DoesntExist(UserModel, 'email')
  email = '';
}
