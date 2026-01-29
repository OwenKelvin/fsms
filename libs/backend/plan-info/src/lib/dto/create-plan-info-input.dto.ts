import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlanInfoInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
