import { Module } from '@nestjs/common';
import { TagBackendService } from './services/tag-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([TagModel])],
  providers: [TagBackendService],
  exports: [TagBackendService],
})
export class TagBackendServiceModule {}
