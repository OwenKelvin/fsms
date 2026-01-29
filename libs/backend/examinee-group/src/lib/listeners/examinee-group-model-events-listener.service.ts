import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ExamineeGroupCreatedEvent } from '../events/examinee-group-created.event';

@Injectable()
export class ExamineeGroupModelEventsListener {
  @OnEvent('examinee-group.created')
  async handleExamineeGroupCreated($event: ExamineeGroupCreatedEvent) {
    Logger.log(
      'Examinee group created event event => id',
      $event.examineeGroup.id,
    );
  }
}
