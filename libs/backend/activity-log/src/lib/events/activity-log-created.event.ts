import { ActivityLogModel } from '@fsms/backend/db';

export class ActivityLogCreatedEvent {
  constructor(public activityLog: ActivityLogModel) {}
}
