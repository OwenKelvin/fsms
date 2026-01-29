import { TransactionModel } from '@fsms/backend/db';

export class TransactionUpdatedEvent {
  constructor(public transaction: TransactionModel) {}
}
