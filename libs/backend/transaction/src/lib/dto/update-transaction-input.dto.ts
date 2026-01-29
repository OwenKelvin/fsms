import { IsInt, ValidateNested } from 'class-validator';
import { CreateTransactionInputDto } from './create-transaction-input.dto';
import { TransactionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateTransactionInputDto {
  @IsInt()
  @Exists(TransactionModel, 'id', {
    message: (validationArguments) =>
      `Transaction with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateTransactionInputDto = { name: '' };
}
