import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InstructionCreatedEvent } from '../events/instruction-created.event';

@Injectable()
export class InstructionModelEventsListener {
  @OnEvent('instruction.created')
  async handleInstructionCreated($event: InstructionCreatedEvent) {
    Logger.log('Examinee created event event => id', $event.instruction.id);
  }
}
