import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { NotificationModel, NotificationUserModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { validateUUID } from '@fsms/backend/util';

export const SEND_NOTIFICATION_QUEUE = 'send-notification-queue';

@Injectable()
export class NotificationBackendService extends CrudAbstractService<NotificationModel> {
  constructor(
    @InjectModel(NotificationModel)
    private notificationModel: typeof NotificationModel,
    @InjectModel(NotificationUserModel)
    private notificationUserModel: typeof NotificationUserModel,
    @InjectQueue(SEND_NOTIFICATION_QUEUE)
    private sendNotificationQueue: Queue<{
      title: string;
      description: string;
      userIds: string[];
    }>,
  ) {
    super(notificationModel);
  }

  async sendNotification(
    title: string,
    description: string,
    userIds: string[],
  ) {
    // Validate all user IDs
    userIds.forEach(userId => validateUUID(userId, 'userId'));
    
    await this.sendNotificationQueue.add({ title, description, userIds });
  }

  async addUsers(notificationId: string, userIds: string[]) {
    validateUUID(notificationId, 'notificationId');
    userIds.forEach(userId => validateUUID(userId, 'userId'));
    
    await this.notificationUserModel.bulkCreate(
      userIds.map((userId) => ({
        userId,
        notificationId,
      })),
    );
  }

  async userStats(userId: string) {
    validateUUID(userId, 'userId');
    
    const total = await this.notificationUserModel.count({
      where: { userId },
    });

    const unread = await this.notificationUserModel.count({
      where: { userId, isRead: false },
    });

    return {
      total,
      unread,
      read: total - unread,
    };
  }
}
