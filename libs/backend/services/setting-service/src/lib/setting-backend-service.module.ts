import { Module } from '@nestjs/common';
import { SettingBackendService } from './services/setting-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SettingModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([SettingModel])],
  providers: [SettingBackendService],
  exports: [SettingBackendService],
})
export class SettingBackendServiceModule {}
