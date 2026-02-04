import { IsInt } from 'class-validator';
import { ExamineeModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteExamineeInputDto {
  @IsInt()
  @Exists(ExamineeModel, 'id', {
    message: (validationArguments) =>
      `Examinee with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
