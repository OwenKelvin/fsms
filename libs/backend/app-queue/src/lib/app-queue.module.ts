import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env['FSMS_REDIS_HOST'],
        port: Number(process.env['FSMS_REDIS_PORT']),
        // password: process.env['FSMS_REDIS_PASSWORD'],
      },
    }),
  ]
})
export class AppQueueModule {}
