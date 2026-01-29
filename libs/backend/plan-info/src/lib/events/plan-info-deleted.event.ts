import { PlanInfoModel } from '@fsms/backend/db';

export class PlanInfoDeletedEvent {
  constructor(public planInfo: PlanInfoModel) {}
}
