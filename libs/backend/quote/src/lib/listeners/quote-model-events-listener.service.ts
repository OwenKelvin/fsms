import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { QuoteCreatedEvent } from '../events/quote-created.event';

@Injectable()
export class QuoteModelEventsListener {
  @OnEvent('quote.created')
  async handleQuoteCreated($event: QuoteCreatedEvent) {
    Logger.log('Examinee created event event => id', $event.quote.id);
  }
}
