import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreditCreatedEvent } from '../events/credit-created.event';

@Injectable()
export class CreditModelEventsListener {
  @OnEvent('credit.created')
  async handleCreditCreated($event: CreditCreatedEvent) {
    Logger.log('Choice created event event => id', $event.credit.id);
  }
}
