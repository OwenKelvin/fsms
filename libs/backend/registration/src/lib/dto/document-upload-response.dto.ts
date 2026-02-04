import { ObjectType, Field } from '@nestjs/graphql';
import { DocumentType } from '@fsms/backend/db';
import { ValidationErrorDto } from './validation-error.dto';

@ObjectType()
export class DocumentUploadResponseDto {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  documentId?: number;

  @Field({ nullable: true })
  fileUploadId?: number;

  @Field(() => String, { nullable: true })
  documentType?: DocumentType;

  @Field({ nullable: true })
  fileName?: string;

  @Field({ nullable: true })
  fileSize?: number;

  @Field({ nullable: true })
  message?: string;

  @Field(() => [ValidationErrorDto], { nullable: true })
  errors?: ValidationErrorDto[];
}