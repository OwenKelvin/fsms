import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env['TAHINIWA_REDIS_HOST'],
        port: Number(process.env['TAHINIWA_REDIS_PORT']),
        // password: process.env['TAHINIWA_REDIS_PASSWORD'],
      },
    }),
  ]
})
export class AppQueueModule {}
