import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  NotificationBackendService,
  NotificationUserBackendService,
} from '@fsms/backend/notification-backend-service';
import { Body, Inject, UseGuards, ValidationPipe } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CurrentUser, JwtAuthGuard } from '@fsms/backend/auth';
import {
  IQueryParam,
  NotificationModel,
  NotificationUserModel,
  QueryOperatorEnum,
  UserModel,
} from '@fsms/backend/db';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { MarkAsReadNotificationInputDto } from '../dto/mark-as-read-notification-input.dto';
import { NotificationUSerUpdatedEvent } from '../events/notification-updated.event';
import { PUB_SUB } from '@fsms/backend/util';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver(() => NotificationUserModel)
export class NotificationUserResolver {
  constructor(
    private notificationUserService: NotificationUserBackendService,
    private notificationService: NotificationBackendService,
    private eventEmitter: EventEmitter2,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Query(() => NotificationModel)
  @UseGuards(JwtAuthGuard)
  async authenticatedUserNotificationStats(@CurrentUser() user: UserModel) {
    return this.notificationService.userStats(user.id);
  }

  @Query(() => NotificationUserModel)
  @UseGuards(JwtAuthGuard)
  authenticatedUserNotifications(
    @Args('query') query: IQueryParam,
    @CurrentUser() user: UserModel,
  ) {
    return this.notificationUserService.findAll({
      ...query,
      filters: [
        ...(query?.filters ?? []),
        {
          operator: QueryOperatorEnum.Equals,
          field: 'userId',
          value: `${user.id}`,
          values: [],
        },
      ],
    });
  }

  @ResolveField()
  async description(@Parent() notificationUserModel: NotificationUserModel) {
    const notification = await this.notificationService.findById(
      notificationUserModel.notificationId,
    );
    return notification?.description ?? '';
  }

  @ResolveField()
  async title(@Parent() notificationUserModel: NotificationUserModel) {
    const notification = await this.notificationService.findById(
      notificationUserModel.notificationId,
    );
    return notification?.title ?? '';
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.MarkNotificationAsRead)
  async markNotificationAsRead(
    @Body(new ValidationPipe()) params: MarkAsReadNotificationInputDto,
    @CurrentUser() currentUser: UserModel,
  ) {
    await Promise.all(
      params.notifications.map(async ({ id }) => {
        const notification = (await this.notificationUserService.findById(
          id,
        )) as NotificationUserModel;

        notification.isRead = true;
        await notification.save();

        this.eventEmitter.emit(
          'notification.updated',
          new NotificationUSerUpdatedEvent(notification),
        );
      }),
    );

    return {
      data: await this.notificationService.userStats(currentUser.id),
      success: true,
      message: 'Successfully mark as read',
    };
  }
}
