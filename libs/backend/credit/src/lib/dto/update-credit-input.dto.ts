import { IsInt, ValidateNested } from 'class-validator';
import { CreateCreditInputDto } from './create-credit-input.dto';
import { CreditModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateCreditInputDto {
  @IsInt()
  @Exists(CreditModel, 'id', {
    message: (validationArguments) =>
      `Credit with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateCreditInputDto = { name: '' };
}
