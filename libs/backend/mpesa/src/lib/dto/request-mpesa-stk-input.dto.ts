import { IsInt } from 'class-validator';
import { Exists } from '@fsms/backend/validators';
import { QuoteModel } from '@fsms/backend/db';

export class RequestMpesaStkInputDto {
  @IsInt()
  @Exists(QuoteModel, 'id', {
    message: (validationArguments) =>
      `Quote with id  ${validationArguments.value}" not found`,
  })
  quoteId!: string;

  // @IsPhoneNumber()
  phoneNumber!: string;
}
