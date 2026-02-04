import { ObjectType, Field } from '@nestjs/graphql';
import { RegistrationStatus } from '@fsms/backend/db';

@ObjectType()
export class RegistrationStatusResponseDto {
  @Field()
  id!: number;

  @Field(() => String)
  status!: RegistrationStatus;

  @Field()
  profileInfoCompleted!: boolean;

  @Field()
  institutionDetailsCompleted!: boolean;

  @Field()
  documentsUploaded!: boolean;

  @Field()
  adminCredentialsCompleted!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field({ nullable: true })
  institutionId?: number;

  @Field({ nullable: true })
  adminUserId?: number;
}