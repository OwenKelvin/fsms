import { PlanModel } from '@fsms/backend/db';

export class PlanDeletedEvent {
  constructor(public plan: PlanModel) {}
}
