import { Module } from '@nestjs/common';
import { PasswordResetModelEventsListener } from './listeners/password-reset-model-events-listener.service';
import { PasswordResetBackendServiceModule } from '@fsms/backend/password-reset-backend-service';
import { PasswordResetResolver } from './resolvers/password-reset.resolver';

@Module({
  imports: [PasswordResetBackendServiceModule],
  providers: [PasswordResetResolver, PasswordResetModelEventsListener],
  exports: [],
})
export class PasswordResetModule {}
