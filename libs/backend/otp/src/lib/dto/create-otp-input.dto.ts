import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOtpInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
