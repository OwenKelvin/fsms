import { IsInt } from 'class-validator';
import { QuoteModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteQuoteInputDto {
  @IsInt()
  @Exists(QuoteModel, 'id', {
    message: (validationArguments) =>
      `Quote with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
