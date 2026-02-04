import { IsInt, ValidateNested } from 'class-validator';
import { CreatePlanInfoInputDto } from './create-plan-info-input.dto';
import { PlanInfoModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdatePlanInfoInputDto {
  @IsInt()
  @Exists(PlanInfoModel, 'id', {
    message: (validationArguments) =>
      `PlanInfo with id  ${validationArguments.value}" not found`,
  })
  id = '';

  @ValidateNested()
  params: CreatePlanInfoInputDto = { name: '' };
}
