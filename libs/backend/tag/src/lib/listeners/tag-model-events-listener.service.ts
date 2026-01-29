import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TagCreatedEvent } from '../events/tag-created.event';

@Injectable()
export class TagModelEventsListener {
  @OnEvent('tag.created')
  async handleTagCreated($event: TagCreatedEvent) {
    Logger.log('Examinee created event event => id', $event.tag.id);
  }
}
