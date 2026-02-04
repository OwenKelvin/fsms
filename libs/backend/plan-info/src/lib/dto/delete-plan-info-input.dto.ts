import { IsInt } from 'class-validator';
import { PlanInfoModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeletePlanInfoInputDto {
  @IsInt()
  @Exists(PlanInfoModel, 'id', {
    message: (validationArguments) =>
      `PlanInfo with id  ${validationArguments.value}" not found`,
  })
  id = '';
}
