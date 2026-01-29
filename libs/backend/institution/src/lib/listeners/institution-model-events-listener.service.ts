import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InstitutionCreatedEvent } from '../events/institution-created.event';

@Injectable()
export class InstitutionModelEventsListener {
  @OnEvent('institution.created')
  async handleInstitutionCreated($event: InstitutionCreatedEvent) {
    Logger.log('Examinee created event event => id', $event.institution.id);
  }
}
