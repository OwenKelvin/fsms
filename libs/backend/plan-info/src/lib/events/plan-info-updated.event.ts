import { PlanInfoModel } from '@fsms/backend/db';

export class PlanInfoUpdatedEvent {
  constructor(public planInfo: PlanInfoModel) {}
}
