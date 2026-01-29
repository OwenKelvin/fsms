import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChoiceCreatedEvent } from '../events/choice-created.event';

@Injectable()
export class ChoiceModelEventsListener {
  @OnEvent('choice.created')
  async handleChoiceCreated($event: ChoiceCreatedEvent) {
    Logger.log('Choice created event event => id', $event.choice.id);
  }
}
