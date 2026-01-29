import { PlanModel } from '@fsms/backend/db';

export class PlanCreatedEvent {
  constructor(public plan: PlanModel) {}
}
