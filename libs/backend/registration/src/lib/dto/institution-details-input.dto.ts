import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { InstitutionType } from '@fsms/backend/db';

@InputType()
export class InstitutionDetailsInputDto {
  @Field()
  @IsNotEmpty({ message: 'Legal name is required' })
  @IsString()
  @MaxLength(255, { message: 'Legal name must be 255 characters or less' })
  legalName!: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Institution type is required' })
  @IsEnum(InstitutionType, { message: 'Invalid institution type' })
  institutionType!: InstitutionType;

  @Field()
  @IsNotEmpty({ message: 'Accreditation number is required' })
  @IsString()
  @MaxLength(100, { message: 'Accreditation number must be 100 characters or less' })
  accreditationNumber!: string;

  @Field()
  @IsNotEmpty({ message: 'Street address is required' })
  @IsString()
  @MaxLength(255, { message: 'Street address must be 255 characters or less' })
  streetAddress!: string;

  @Field()
  @IsNotEmpty({ message: 'City is required' })
  @IsString()
  @MaxLength(100, { message: 'City must be 100 characters or less' })
  city!: string;

  @Field()
  @IsNotEmpty({ message: 'State/Province is required' })
  @IsString()
  @MaxLength(100, { message: 'State/Province must be 100 characters or less' })
  stateProvince!: string;

  @Field()
  @IsNotEmpty({ message: 'ZIP/Postal code is required' })
  @IsString()
  @MaxLength(20, { message: 'ZIP/Postal code must be 20 characters or less' })
  zipPostalCode!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid website URL format' })
  officialWebsite?: string;
}