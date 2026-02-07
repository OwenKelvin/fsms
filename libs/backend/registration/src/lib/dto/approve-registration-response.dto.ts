import { Field, ObjectType } from '@nestjs/graphql';
import { RegistrationDetailsResponseDto } from './registration-details-response.dto';

@ObjectType()
export class ApproveRegistrationResponseDto {
  @Field()
  success!: boolean;

  @Field(() => RegistrationDetailsResponseDto, { nullable: true })
  registration?: RegistrationDetailsResponseDto;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  error?: string;
}
