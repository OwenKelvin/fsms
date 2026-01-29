import { Module } from '@nestjs/common';
import { NotificationModelEventsListener } from './listeners/notification-model-events-listener.service';
import { NotificationBackendServiceModule } from '@fsms/backend/notification-backend-service';
import { NotificationResolver } from './resolvers/notification.resolver';
import { PubSubProviderModule } from '@fsms/backend/util';
import { NotificationUserResolver } from './resolvers/notification-user.resolver';

@Module({
  imports: [NotificationBackendServiceModule, PubSubProviderModule],
  providers: [
    NotificationResolver,
    NotificationModelEventsListener,
    NotificationUserResolver,
  ],
  exports: [],
})
export class NotificationModule {}
