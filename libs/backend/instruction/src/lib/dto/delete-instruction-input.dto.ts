import { IsInt } from 'class-validator';
import { InstructionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class DeleteInstructionInputDto {
  @IsInt()
  @Exists(InstructionModel, 'id', {
    message: (validationArguments) =>
      `Instruction with id  ${validationArguments.value}" not found`,
  })
  id = 0;
}
