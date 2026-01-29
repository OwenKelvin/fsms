import { NotificationModel, NotificationUserModel } from '@fsms/backend/db';

export class NotificationUpdatedEvent {
  constructor(public notification: NotificationModel) {}
}

export class NotificationUSerUpdatedEvent {
  constructor(public notificationUser: NotificationUserModel) {}
}
