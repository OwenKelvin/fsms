import { IsInt } from 'class-validator';
import { ExamineeGroupModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteExamineeGroupInputDto {
  @IsInt()
  @Exists(ExamineeGroupModel, 'id', {
    message: (validationArguments) =>
      `ExamineeGroup with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
