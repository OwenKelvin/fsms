import { Field, ObjectType } from '@nestjs/graphql';
import { ValidationErrorDto } from './validation-error.dto';

@ObjectType()
export class CompleteRegistrationResponseDto {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  institutionId?: number;

  @Field({ nullable: true })
  adminUserId?: number;

  @Field({ nullable: true })
  message?: string;

  @Field(() => [ValidationErrorDto], { nullable: true })
  errors?: ValidationErrorDto[];
}
