import { InstructionModel } from '@fsms/backend/db';

export class InstructionUpdatedEvent {
  constructor(public instruction: InstructionModel) {}
}
