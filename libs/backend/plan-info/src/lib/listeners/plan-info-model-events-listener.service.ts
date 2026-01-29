import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PlanInfoCreatedEvent } from '../events/plan-info-created.event';

@Injectable()
export class PlanInfoModelEventsListener {
  @OnEvent('plan-info.created')
  async handlePlanInfoCreated($event: PlanInfoCreatedEvent) {
    Logger.log('Examinee created event event => id', $event.planInfo.id);
  }
}
