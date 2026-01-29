import { IsInt } from 'class-validator';
import { QuestionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteQuestionInputDto {
  @IsInt()
  @Exists(QuestionModel, 'id', {
    message: (validationArguments) =>
      `Question with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
