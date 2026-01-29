import { ActivityLogModel } from '@fsms/backend/db';

export class ActivityLogDeletedEvent {
  constructor(public activityLog: ActivityLogModel) {}
}
