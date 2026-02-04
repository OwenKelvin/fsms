import { IsInt } from 'class-validator';
import { PlanModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeletePlanInputDto {
  @IsInt()
  @Exists(PlanModel, 'id', {
    message: (validationArguments) =>
      `Plan with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
