import { Module } from '@nestjs/common';
import { OtpBackendService } from './services/otp-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OtpModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([OtpModel])],
  providers: [OtpBackendService],
  exports: [OtpBackendService],
})
export class OtpBackendServiceModule {}
