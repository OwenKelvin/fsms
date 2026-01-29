import { TransactionModel } from '@fsms/backend/db';

export class TransactionCreatedEvent {
  constructor(public transaction: TransactionModel) {}
}
