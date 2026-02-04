import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class ProfileInfoInputDto {
  @Field()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @MaxLength(100, { message: 'First name must be 100 characters or less' })
  firstName!: string;

  @Field()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @MaxLength(100, { message: 'Last name must be 100 characters or less' })
  lastName!: string;

  @Field()
  @IsNotEmpty({ message: 'Job title is required' })
  @IsString()
  @MaxLength(100, { message: 'Job title must be 100 characters or less' })
  jobTitle!: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;
}
