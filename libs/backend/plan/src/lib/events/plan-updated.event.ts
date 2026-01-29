import { PlanModel } from '@fsms/backend/db';

export class PlanUpdatedEvent {
  constructor(public plan: PlanModel) {}
}
