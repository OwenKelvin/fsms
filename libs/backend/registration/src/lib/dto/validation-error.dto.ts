import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ValidationErrorDto {
  @Field()
  field!: string;

  @Field()
  message!: string;
}
