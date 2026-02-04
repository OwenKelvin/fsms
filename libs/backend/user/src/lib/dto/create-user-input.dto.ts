import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { UserModel } from '@fsms/backend/db';
import { DoesntExist } from '@fsms/backend/validators';

export class CreateUserInputDto {
  @IsString()
  @IsNotEmpty()
  firstName = '';

  @IsString()
  @IsNotEmpty()
  lastName = '';

  @IsNotEmpty()
  @IsEmail()
  @DoesntExist(
    UserModel,
    'email',
    { isAdmin: false },
    { message: 'Email already taken' },
  )
  email = '';

  @IsPhoneNumber()
  @DoesntExist(
    UserModel,
    'phone',
    { isAdmin: true },
    { message: 'Phone already taken' },
  )
  phone = '';
}
