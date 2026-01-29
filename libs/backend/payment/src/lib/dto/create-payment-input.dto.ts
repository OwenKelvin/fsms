import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
