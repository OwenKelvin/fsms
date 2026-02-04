import { IsInt, ValidateNested } from 'class-validator';
import { CreateExamineeInputDto } from './create-examinee-input.dto';
import { ExamineeModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateExamineeInputDto {
  @IsInt()
  @Exists(ExamineeModel, 'id', {
    message: (validationArguments) =>
      `Examinee with id  ${validationArguments.value}" not found`,
  })
  id = '';

  @ValidateNested()
  params: CreateExamineeInputDto = { uniqueIdentifier: '' };
}
