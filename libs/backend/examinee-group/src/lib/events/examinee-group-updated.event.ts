import { ExamineeGroupModel } from '@fsms/backend/db';

export class ExamineeGroupUpdatedEvent {
  constructor(public examineeGroup: ExamineeGroupModel) {}
}
