import { ExamPaperModel } from '@fsms/backend/db';

export class ExamPaperEvent {
  constructor(public examPaper: ExamPaperModel) {}
}
