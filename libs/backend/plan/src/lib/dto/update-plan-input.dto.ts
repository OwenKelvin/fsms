import { IsInt, ValidateNested } from 'class-validator';
import { CreatePlanInputDto } from './create-plan-input.dto';
import { PlanModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdatePlanInputDto {
  @IsInt()
  @Exists(PlanModel, 'id', {
    message: (validationArguments) =>
      `Plan with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreatePlanInputDto = { name: '' };
}
