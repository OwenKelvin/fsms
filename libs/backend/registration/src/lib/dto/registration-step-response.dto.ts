import { ObjectType, Field } from '@nestjs/graphql';
import { ValidationErrorDto } from './validation-error.dto';

@ObjectType()
export class RegistrationStepResponseDto {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  registrationId?: number;

  @Field({ nullable: true })
  message?: string;

  @Field(() => [ValidationErrorDto], { nullable: true })
  errors?: ValidationErrorDto[];
}