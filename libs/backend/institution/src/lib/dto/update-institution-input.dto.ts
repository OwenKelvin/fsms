import { IsUUID, ValidateNested } from 'class-validator';
import { CreateInstitutionInputDto } from './create-institution-input.dto';
import { InstitutionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateInstitutionInputDto {
  @IsUUID(4, { message: 'id must be a valid UUID v4' })
  @Exists(InstitutionModel, 'id', {
    message: (validationArguments) =>
      `Institution with id  ${validationArguments.value}" not found`,
  })
  id = '';

  @ValidateNested()
  params: CreateInstitutionInputDto = { name: '' };
}
