import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChoiceInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
