import { PaymentModel } from '@fsms/backend/db';

export class PaymentCreatedEvent {
  constructor(public payment: PaymentModel) {}
}
