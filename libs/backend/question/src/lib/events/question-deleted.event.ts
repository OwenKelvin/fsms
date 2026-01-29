import { QuestionModel } from '@fsms/backend/db';

export class QuestionDeletedEvent {
  constructor(public question: QuestionModel) {}
}
