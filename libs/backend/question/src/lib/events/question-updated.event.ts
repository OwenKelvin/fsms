import { QuestionModel } from '@fsms/backend/db';

export class QuestionUpdatedEvent {
  constructor(public question: QuestionModel) {}
}
