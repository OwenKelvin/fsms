import { Module } from '@nestjs/common';
import { ConfigBackendService } from './services/config-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([ConfigModel])],
  providers: [ConfigBackendService],
  exports: [ConfigBackendService],
})
export class ConfigBackendServiceModule {}
