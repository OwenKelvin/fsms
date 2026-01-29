import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCreditInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
