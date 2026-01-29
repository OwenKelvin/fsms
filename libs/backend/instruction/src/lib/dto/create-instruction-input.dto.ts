import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Exists } from '@fsms/backend/validators';
import { ExamPaperModel } from '@fsms/backend/db';

export class CreateInstructionInputDto {
  @IsInt()
  @Exists(ExamPaperModel, 'id', {
    message: (validationArguments) =>
      `Exam paper with id  ${validationArguments.value}" not found`,
  })
  examPaperId = 0;

  @IsString()
  @IsNotEmpty()
  description = '';
}
