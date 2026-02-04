import { IsInt } from 'class-validator';
import { CreditModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteCreditInputDto {
  @IsInt()
  @Exists(CreditModel, 'id', {
    message: (validationArguments) =>
      `Credit with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
