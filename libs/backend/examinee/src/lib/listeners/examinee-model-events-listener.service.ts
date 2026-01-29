import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ExamineeCreatedEvent } from '../events/examinee-created.event';

@Injectable()
export class ExamineeModelEventsListener {
  @OnEvent('examinee.created')
  async handleExamineeCreated($event: ExamineeCreatedEvent) {
    Logger.log('Examinee created event event => id', $event.examinee.id);
  }
}
