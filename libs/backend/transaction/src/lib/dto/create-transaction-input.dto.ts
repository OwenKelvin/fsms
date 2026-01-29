import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
