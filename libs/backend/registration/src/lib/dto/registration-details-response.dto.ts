import { Field, ObjectType } from '@nestjs/graphql';
import {
  InstitutionModel,
  RegistrationStatus,
  UserModel,
} from '@fsms/backend/db';

@ObjectType()
export class RegistrationStatusHistoryDto {
  @Field()
  id!: string;

  @Field(() => String, { nullable: true })
  previousStatus?: RegistrationStatus;

  @Field(() => String)
  newStatus!: RegistrationStatus;

  @Field()
  changedAt!: Date;

  @Field({ nullable: true })
  changedBy?: string;

  @Field({ nullable: true })
  notes?: string;
}

@ObjectType()
export class RegistrationDetailsResponseDto {
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

  @Field(() => InstitutionModel, { nullable: true })
  institution?: InstitutionModel;

  @Field(() => UserModel, { nullable: true })
  adminUser?: UserModel;

  @Field(() => [RegistrationStatusHistoryDto], { nullable: true })
  statusHistory?: RegistrationStatusHistoryDto[];
}
