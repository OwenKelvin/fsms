import { Module } from '@nestjs/common';
import { PlanBackendService } from './services/plan-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlanModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([PlanModel])],
  providers: [PlanBackendService],
  exports: [PlanBackendService],
})
export class PlanBackendServiceModule {}
