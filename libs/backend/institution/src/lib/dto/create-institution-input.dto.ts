import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInstitutionInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';
}
