import { NotificationModel } from '@fsms/backend/db';

export class NotificationCreatedEvent {
  constructor(public notification: NotificationModel) {}
}
