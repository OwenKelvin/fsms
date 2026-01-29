import { IsInt, ValidateNested } from 'class-validator';
import { CreateExamineeGroupInputDto } from './create-examinee-group-input.dto';
import { ExamineeGroupModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateExamineeGroupInputDto {
  @IsInt()
  @Exists(ExamineeGroupModel, 'id', {
    message: (validationArguments) =>
      `ExamineeGroup with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateExamineeGroupInputDto = { examinees: [], name: '' };
}
