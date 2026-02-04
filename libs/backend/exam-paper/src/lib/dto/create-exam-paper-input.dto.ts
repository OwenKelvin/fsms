import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Exists } from '@fsms/backend/validators';
import { ConfigModel, ExamModel } from '@fsms/backend/db';

class CreateExamPaperTagInput {
  @IsOptional()
  @IsString()
  tagName?: string;

  @IsOptional()
  @IsNumber()
  tagId?: string;
}

class CreateExamPaperConfigInput {
  @IsNumber()
  @Exists(ConfigModel, 'id', {
    message: (validationArguments) =>
      `Config with id  ${validationArguments.value}" not found`,
  })
  id?: string;

  @IsBoolean()
  selected?: boolean;

  @IsOptional()
  @IsString()
  value?: string;
}

export class CreateExamPaperInputDto {
  @IsNotEmpty()
  name = '';

  @Exists(ExamModel, 'id', {
    message: (validationArguments) =>
      `Exam with id  ${validationArguments.value}" not found`,
  })
  examId?: string;

  @IsOptional()
  @IsDateString()
  paperDate?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExamPaperTagInput)
  tags: CreateExamPaperTagInput[] = [];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExamPaperConfigInput)
  configs: CreateExamPaperConfigInput[] = [];
}
