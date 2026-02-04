import { IsInt, ValidateNested } from 'class-validator';
import { CreateExamInputDto } from './create-exam-input.dto';
import { ExamModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateExamInputDto {
  @IsInt()
  @Exists(ExamModel, 'id', {
    message: (validationArguments) =>
      `Exam with id  ${validationArguments.value}" not found`,
  })
  id = '';

  @ValidateNested()
  params: CreateExamInputDto = { configs: [], tags: [], name: '' };
}
