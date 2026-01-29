import { Module } from '@nestjs/common';
import { PlanInfoBackendService } from './services/plan-info-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlanInfoModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([PlanInfoModel])],
  providers: [PlanInfoBackendService],
  exports: [PlanInfoBackendService],
})
export class PlanInfoBackendServiceModule {}
