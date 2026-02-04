import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { RegistrationStatus } from '@fsms/backend/db';

@InputType()
export class RegistrationFilterInputDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(RegistrationStatus, { message: 'Invalid registration status' })
  status?: RegistrationStatus;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(RegistrationStatus, { each: true, message: 'Invalid registration status in array' })
  statuses?: RegistrationStatus[];

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid start date format' })
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid end date format' })
  endDate?: string;
}