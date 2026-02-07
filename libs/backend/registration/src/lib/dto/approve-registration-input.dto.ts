import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class ApproveRegistrationInputDto {
  @Field()
  @IsNotEmpty({ message: 'Registration ID is required' })
  @IsUUID('4', { message: 'Registration ID must be a valid UUID' })
  registrationId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
