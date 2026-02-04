import { IsUUID } from 'class-validator';
import { InstitutionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteInstitutionInputDto {
  @IsUUID(4, { message: 'id must be a valid UUID v4' })
  @Exists(InstitutionModel, 'id', {
    message: (validationArguments) =>
      `Institution with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
