import { QuestionModel } from '@fsms/backend/db';

export class QuestionCreatedEvent {
  constructor(public question: QuestionModel) {}
}
