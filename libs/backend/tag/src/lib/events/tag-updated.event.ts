import { TagModel } from '@fsms/backend/db';

export class TagUpdatedEvent {
  constructor(public tag: TagModel) {}
}
