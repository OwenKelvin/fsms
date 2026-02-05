import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class InstitutionTypeOption {
  @Field()
  key!: string;

  @Field()
  description = '';
}
