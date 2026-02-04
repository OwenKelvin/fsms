import { Field, ObjectType } from '@nestjs/graphql';
import { ValidationErrorDto } from './validation-error.dto';

@ObjectType()
export class CompleteRegistrationResponseDto {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  institutionId?: string;

  @Field({ nullable: true })
  adminUserId?: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => [ValidationErrorDto], { nullable: true })
  errors?: ValidationErrorDto[];
}
