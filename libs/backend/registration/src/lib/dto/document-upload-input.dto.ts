import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { DocumentType } from '@fsms/backend/db';

@InputType()
export class DocumentUploadInputDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Document type is required' })
  @IsEnum(DocumentType, { message: 'Invalid document type' })
  documentType!: DocumentType;

  @Field()
  @IsNotEmpty({ message: 'Registration ID is required' })
  @IsNumber({}, { message: 'Registration ID must be a number' })
  registrationId!: number;
}
