import { QuoteModel } from '@fsms/backend/db';

export class QuoteCreatedEvent {
  constructor(public quote: QuoteModel) {}
}
