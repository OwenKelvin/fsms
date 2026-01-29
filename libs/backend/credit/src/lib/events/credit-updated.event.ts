import { CreditModel } from '@fsms/backend/db';

export class CreditUpdatedEvent {
  constructor(public credit: CreditModel) {}
}
