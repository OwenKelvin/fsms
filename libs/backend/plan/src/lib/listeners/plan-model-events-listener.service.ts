import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PlanCreatedEvent } from '../events/plan-created.event';

@Injectable()
export class PlanModelEventsListener {
  @OnEvent('plan.created')
  async handlePlanCreated($event: PlanCreatedEvent) {
    Logger.log('Plan created event event => id', $event.plan.id);
  }
}
