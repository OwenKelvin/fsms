import { ExamineeModel } from '@fsms/backend/db';

export class ExamineeCreatedEvent {
  constructor(public examinee: ExamineeModel) {}
}
