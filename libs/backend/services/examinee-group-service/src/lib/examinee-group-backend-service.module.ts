import { Module } from '@nestjs/common';
import { ExamineeGroupBackendService } from './services/examinee-group-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExamineeGroupModel, ExamineeModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([ExamineeGroupModel, ExamineeModel])],
  providers: [ExamineeGroupBackendService],
  exports: [ExamineeGroupBackendService],
})
export class ExamineeGroupBackendServiceModule {}
