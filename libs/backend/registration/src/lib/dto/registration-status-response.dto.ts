import { Field, ObjectType } from '@nestjs/graphql';
import { RegistrationStatus } from '@fsms/backend/db';

@ObjectType()
export class RegistrationStatusResponseDto {
  @Field()
  id!: string;

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
  institutionId?: string;

  @Field({ nullable: true })
  adminUserId?: string;
}
