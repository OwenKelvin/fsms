import { PaymentModel } from '@fsms/backend/db';

export class PaymentUpdatedEvent {
  constructor(public payment: PaymentModel) {}
}
