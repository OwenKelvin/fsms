import { PaymentModel } from '@fsms/backend/db';

export class PaymentDeletedEvent {
  constructor(public payment: PaymentModel) {}
}
