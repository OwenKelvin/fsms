import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlanInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
