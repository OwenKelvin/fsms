import { CreditModel } from '@fsms/backend/db';

export class CreditCreatedEvent {
  constructor(public credit: CreditModel) {}
}
