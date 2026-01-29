import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateExamineeOtherDetailsInputDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  email?: string;
}

export class CreateExamineeInputDto {
  @IsString()
  @IsNotEmpty()
  uniqueIdentifier = '';

  @IsOptional()
  @ValidateNested()
  otherDetails?: CreateExamineeOtherDetailsInputDto;
}
