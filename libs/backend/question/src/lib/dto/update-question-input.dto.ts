import { IsInt, ValidateNested } from 'class-validator';
import { CreateQuestionInputDto } from './create-question-input.dto';
import { QuestionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateQuestionInputDto {
  @IsInt()
  @Exists(QuestionModel, 'id', {
    message: (validationArguments) =>
      `Question with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateQuestionInputDto = {
    choices: [],
    choiceType: 'Radio',
    autoMark: false,
    description: '',
    tags: [],
  };
}
