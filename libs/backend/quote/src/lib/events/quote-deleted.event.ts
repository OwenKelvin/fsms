import { QuoteModel } from '@fsms/backend/db';

export class QuoteDeletedEvent {
  constructor(public quote: QuoteModel) {}
}
