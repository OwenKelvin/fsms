import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class RejectRegistrationInputDto {
  @Field()
  @IsNotEmpty({ message: 'Registration ID is required' })
  @IsUUID('4', { message: 'Registration ID must be a valid UUID' })
  registrationId!: string;

  @Field()
  @IsNotEmpty({ message: 'Rejection reason is required' })
  @IsString()
  reason!: string;
}
