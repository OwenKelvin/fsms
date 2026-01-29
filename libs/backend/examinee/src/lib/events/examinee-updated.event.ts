import { ExamineeModel } from '@fsms/backend/db';

export class ExamineeUpdatedEvent {
  constructor(public examinee: ExamineeModel) {}
}
