import { ActivityLogModel } from '@fsms/backend/db';

export class ActivityLogUpdatedEvent {
  constructor(public activityLog: ActivityLogModel) {}
}
