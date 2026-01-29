import { IsInt } from 'class-validator';
import { TagModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteTagInputDto {
  @IsInt()
  @Exists(TagModel, 'id', {
    message: (validationArguments) =>
      `Tag with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
