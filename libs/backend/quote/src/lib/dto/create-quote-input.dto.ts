import { IsInt, IsNotEmpty } from 'class-validator';
import { Exists } from '@fsms/backend/validators';
import { PlanModel } from '@fsms/backend/db';

export class CreateQuoteInputDto {
  @IsInt()
  @IsNotEmpty()
  @Exists(PlanModel, 'id', {
    message: (validationArguments) =>
      `Plan with id  ${validationArguments.value}" not found`,
  })
  planId!: number;

  @IsInt()
  @IsNotEmpty()
  creditAmount!: number;
}
