import { ExamModel } from '@fsms/backend/db';

export class ExamUpdateEvent {
  constructor(public exam: ExamModel) {}
}
