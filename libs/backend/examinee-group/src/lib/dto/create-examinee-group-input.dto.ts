import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Exists } from '@fsms/backend/validators';
import { ExamineeModel } from '@fsms/backend/db';

class ExamineeOtherDetailsInputDtp {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

class ExamineeInputDtp {
  @IsInt()
  @IsOptional()
  @Exists(ExamineeModel, 'id', {
    message: (validationArguments) =>
      `Examinee with id  ${validationArguments.value}" not found`,
  })
  id?: number;

  @IsString()
  @IsOptional()
  uniqueIdentifier?: string;

  @ValidateNested()
  otherDetails?: ExamineeOtherDetailsInputDtp;
}

export class CreateExamineeGroupInputDto {
  @IsString()
  @IsNotEmpty()
  name = '';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamineeInputDtp)
  examinees: ExamineeInputDtp[] = [];
}
