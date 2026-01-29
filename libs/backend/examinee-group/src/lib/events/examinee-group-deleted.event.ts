import { ExamineeGroupModel } from '@fsms/backend/db';

export class ExamineeGroupDeletedEvent {
  constructor(public examineeGroup: ExamineeGroupModel) {}
}
