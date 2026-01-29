import { IsInt } from 'class-validator';
import { InstitutionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteInstitutionInputDto {
  @IsInt()
  @Exists(InstitutionModel, 'id', {
    message: (validationArguments) =>
      `Institution with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
