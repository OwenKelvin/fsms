import { IsInt } from 'class-validator';
import { TransactionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteTransactionInputDto {
  @IsInt()
  @Exists(TransactionModel, 'id', {
    message: (validationArguments) =>
      `Transaction with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
