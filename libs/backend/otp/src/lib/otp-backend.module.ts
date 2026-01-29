import { Module } from '@nestjs/common';
import { OtpModelEventsListener } from './listeners/otp-model-events-listener.service';
import { OtpBackendServiceModule } from '@fsms/backend/otp-backend-service';
import { OtpResolver } from './resolvers/otp.resolver';

@Module({
  imports: [OtpBackendServiceModule],
  providers: [OtpResolver, OtpModelEventsListener],
  exports: [],
})
export class OtpModule {}
