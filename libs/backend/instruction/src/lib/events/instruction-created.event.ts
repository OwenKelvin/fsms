import { InstructionModel } from '@fsms/backend/db';

export class InstructionCreatedEvent {
  constructor(public instruction: InstructionModel) {}
}
