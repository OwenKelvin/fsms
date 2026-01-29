import { ExamineeModel } from '@fsms/backend/db';

export class ExamineeDeletedEvent {
  constructor(public examinee: ExamineeModel) {}
}
