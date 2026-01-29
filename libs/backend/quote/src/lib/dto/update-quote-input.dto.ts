import { IsInt, ValidateNested } from 'class-validator';
import { CreateQuoteInputDto } from './create-quote-input.dto';
import { QuoteModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateQuoteInputDto {
  @IsInt()
  @Exists(QuoteModel, 'id', {
    message: (validationArguments) =>
      `Quote with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateQuoteInputDto = { creditAmount: 0, planId: 0 };
}
