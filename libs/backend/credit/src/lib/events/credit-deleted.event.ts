import { CreditModel } from '@fsms/backend/db';

export class CreditDeletedEvent {
  constructor(public credit: CreditModel) {}
}
