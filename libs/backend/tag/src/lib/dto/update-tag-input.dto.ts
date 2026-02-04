import { IsInt, ValidateNested } from 'class-validator';
import { CreateTagInputDto } from './create-tag-input.dto';
import { TagModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateTagInputDto {
  @IsInt()
  @Exists(TagModel, 'id', {
    message: (validationArguments) =>
      `Tag with id  ${validationArguments.value}" not found`,
  })
  id = '';

  @ValidateNested()
  params: CreateTagInputDto = { name: '' };
}
