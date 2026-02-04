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
import { Exists, IsBefore } from '@fsms/backend/validators';
import { ConfigModel } from '@fsms/backend/db';

class CreateExamTagInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  id?: string;
}

class CreateExamConfigInput {
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

export class CreateExamInputDto {
  @IsNotEmpty()
  name = '';

  @IsOptional()
  @IsDateString()
  @IsBefore('endDate')
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExamTagInput)
  tags: CreateExamTagInput[] = [];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExamConfigInput)
  configs: CreateExamConfigInput[] = [];
}
