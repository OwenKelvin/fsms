import { TransactionModel } from '@fsms/backend/db';

export class TransactionDeletedEvent {
  constructor(public transaction: TransactionModel) {}
}
