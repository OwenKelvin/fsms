import { PlanInfoModel } from '@fsms/backend/db';

export class PlanInfoCreatedEvent {
  constructor(public planInfo: PlanInfoModel) {}
}
