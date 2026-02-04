import { Field, ObjectType } from '@nestjs/graphql';
import { ValidationErrorDto } from './validation-error.dto';

@ObjectType()
export class RegistrationStepResponseDto {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  registrationId?: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => [ValidationErrorDto], { nullable: true })
  errors?: ValidationErrorDto[];
}
