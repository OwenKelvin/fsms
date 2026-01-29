import { IsArray, IsInt, ValidateNested } from 'class-validator';
import { ExamineeGroupModel, ExamPaperModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';
import { Type } from 'class-transformer';

class ExamineeCategoryInputDto {
  @IsInt()
  @Exists(ExamineeGroupModel, 'id', {
    message: (validationArguments) =>
      `Examinee group with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}

export class AssignExamineeGroupToExamPaperInputDto {
  @IsInt()
  @Exists(ExamPaperModel, 'id', {
    message: (validationArguments) =>
      `ExamPaper with id  ${validationArguments.value}" not found`,
  })
  examPaperId = 0;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamineeCategoryInputDto)
  examineeGroups: ExamineeCategoryInputDto[] = [];
}
