import { IsInt, ValidateNested } from 'class-validator';
import { CreateInstitutionInputDto } from './create-institution-input.dto';
import { InstitutionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateInstitutionInputDto {
  @IsInt()
  @Exists(InstitutionModel, 'id', {
    message: (validationArguments) =>
      `Institution with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateInstitutionInputDto = { name: '' };
}
