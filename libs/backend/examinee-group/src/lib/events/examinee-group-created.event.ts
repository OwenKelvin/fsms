import { ExamineeGroupModel } from '@fsms/backend/db';

export class ExamineeGroupCreatedEvent {
  constructor(public examineeGroup: ExamineeGroupModel) {}
}
