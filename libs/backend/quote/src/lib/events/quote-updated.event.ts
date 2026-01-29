import { QuoteModel } from '@fsms/backend/db';

export class QuoteUpdatedEvent {
  constructor(public quote: QuoteModel) {}
}
