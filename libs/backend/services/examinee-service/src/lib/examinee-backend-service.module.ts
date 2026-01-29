import { Module } from '@nestjs/common';
import { ExamineeBackendService } from './services/examinee-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExamineeModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([ExamineeModel])],
  providers: [ExamineeBackendService],
  exports: [ExamineeBackendService],
})
export class ExamineeBackendServiceModule {}
