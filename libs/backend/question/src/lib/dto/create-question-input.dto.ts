import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Exists } from '@fsms/backend/validators';
import { ExamPaperModel } from '@fsms/backend/db';
import { Type } from 'class-transformer';

class QuestionChoiceInputDto {
  @IsString()
  @IsNotEmpty()
  description = '';

  @IsBoolean()
  @IsNotEmpty()
  isCorrectChoice = false;
}

class CreateQuestionTagInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  id?: string;
}

export class CreateQuestionInputDto {
  @IsString()
  @IsNotEmpty()
  description = '';

  @IsOptional()
  correctChoiceExplanation?: string;

  @IsEnum(['Input', 'CheckBox', 'Radio'])
  @IsNotEmpty()
  choiceType: 'Input' | 'Checkbox' | 'Radio' = 'Radio';

  @IsBoolean()
  @IsNotEmpty()
  autoMark = true;

  @IsNumber()
  @Exists(ExamPaperModel, 'id', {
    message: (validationArguments) =>
      `Exam paper with id  ${validationArguments.value}" not found`,
  })
  examPaperId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionChoiceInputDto)
  choices: QuestionChoiceInputDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionTagInput)
  tags: CreateQuestionTagInput[] = [];
}
