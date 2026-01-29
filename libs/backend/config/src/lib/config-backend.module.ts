import { Module } from '@nestjs/common';
import { ConfigModelEventsListener } from './listeners/config-model-events-listener.service';
import { ConfigBackendServiceModule } from '@fsms/backend/config-backend-service';
import { ConfigResolver } from './resolvers/config.resolver';

@Module({
  imports: [ConfigBackendServiceModule],
  providers: [ConfigResolver, ConfigModelEventsListener],
  exports: [],
})
export class ConfigModule {}
