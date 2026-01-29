import { NotificationModel } from '@fsms/backend/db';

export class NotificationDeletedEvent {
  constructor(public notification: NotificationModel) {}
}
