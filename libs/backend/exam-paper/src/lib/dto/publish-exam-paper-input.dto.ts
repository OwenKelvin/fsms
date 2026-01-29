import { IsInt } from 'class-validator';
import { ExamPaperModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class PublishExamPaperInputDto {
  @IsInt()
  @Exists(ExamPaperModel, 'id', {
    message: (validationArguments) =>
      `ExamPaper with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
