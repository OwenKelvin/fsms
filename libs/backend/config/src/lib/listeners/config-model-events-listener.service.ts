import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigCreatedEvent } from '../events/config-created.event';

@Injectable()
export class ConfigModelEventsListener {
  @OnEvent('config.created')
  async handleConfigCreated($event: ConfigCreatedEvent) {
    Logger.log('Choice created event event => id', $event.config.id);
  }
}
