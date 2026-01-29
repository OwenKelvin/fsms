import { TagModel } from '@fsms/backend/db';

export class TagDeletedEvent {
  constructor(public tag: TagModel) {}
}
