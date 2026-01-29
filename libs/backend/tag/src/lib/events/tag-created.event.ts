import { TagModel } from '@fsms/backend/db';

export class TagCreatedEvent {
  constructor(public tag: TagModel) {}
}
