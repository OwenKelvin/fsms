import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
