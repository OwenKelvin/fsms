import { IsInt } from 'class-validator';
import { ChoiceModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteChoiceInputDto {
  @IsInt()
  @Exists(ChoiceModel, 'id', {
    message: (validationArguments) =>
      `Choice with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
