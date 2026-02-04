import { IsInt } from 'class-validator';
import { ExamModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteExamInputDto {
  @IsInt()
  @Exists(ExamModel, 'id', {
    message: (validationArguments) =>
      `Exam with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
