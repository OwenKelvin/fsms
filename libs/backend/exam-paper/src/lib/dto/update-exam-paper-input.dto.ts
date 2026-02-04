import { IsInt, ValidateNested } from 'class-validator';
import { CreateExamPaperInputDto } from './create-exam-paper-input.dto';
import { ExamPaperModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateExamPaperInputDto {
  @IsInt()
  @Exists(ExamPaperModel, 'id', {
    message: (validationArguments) =>
      `ExamPaper with id  ${validationArguments.value}" not found`,
  })
  id = '';

  @ValidateNested()
  params: CreateExamPaperInputDto = { configs: [], tags: [], name: '' };
}
