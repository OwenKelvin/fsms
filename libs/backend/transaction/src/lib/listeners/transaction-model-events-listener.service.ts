import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransactionCreatedEvent } from '../events/transaction-created.event';

@Injectable()
export class TransactionModelEventsListener {
  @OnEvent('transaction.created')
  async handleTransactionCreated($event: TransactionCreatedEvent) {
    Logger.log('Examinee created event event => id: ', $event.transaction.id);
  }
}
