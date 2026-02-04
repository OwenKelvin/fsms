import { IsInt } from 'class-validator';
import { PaymentModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeletePaymentInputDto {
  @IsInt()
  @Exists(PaymentModel, 'id', {
    message: (validationArguments) =>
      `Payment with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
