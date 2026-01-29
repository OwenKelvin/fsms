import { InstructionModel } from '@fsms/backend/db';

export class InstructionDeletedEvent {
  constructor(public instruction: InstructionModel) {}
}
