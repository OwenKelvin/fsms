import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentCreatedEvent } from '../events/payment-created.event';

@Injectable()
export class PaymentModelEventsListener {
  @OnEvent('payment.created')
  async handlePaymentCreated($event: PaymentCreatedEvent) {
    Logger.log('Payment created event event => id', $event.payment.id);
  }
}
