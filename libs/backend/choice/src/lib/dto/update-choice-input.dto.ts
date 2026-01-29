import { IsInt, ValidateNested } from 'class-validator';
import { CreateChoiceInputDto } from './create-choice-input.dto';
import { ChoiceModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateChoiceInputDto {
  @IsInt()
  @Exists(ChoiceModel, 'id', {
    message: (validationArguments) =>
      `Choice with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateChoiceInputDto = { name: '' };
}
