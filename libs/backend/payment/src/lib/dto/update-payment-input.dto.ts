import { IsInt, ValidateNested } from 'class-validator';
import { CreatePaymentInputDto } from './create-payment-input.dto';
import { PaymentModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdatePaymentInputDto {
  @IsInt()
  @Exists(PaymentModel, 'id', {
    message: (validationArguments) =>
      `Payment with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreatePaymentInputDto = { name: '' };
}
