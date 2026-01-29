import { IsInt, ValidateNested } from 'class-validator';
import { CreateInstructionInputDto } from './create-instruction-input.dto';
import { InstructionModel } from '@fsms/backend/db';
import { Exists } from '@fsms/backend/validators';

export class UpdateInstructionInputDto {
  @IsInt()
  @Exists(InstructionModel, 'id', {
    message: (validationArguments) =>
      `Instruction with id  ${validationArguments.value}" not found`,
  })
  id = 0;

  @ValidateNested()
  params: CreateInstructionInputDto = { description: '', examPaperId: 0 };
}
