import { Module } from '@nestjs/common';
import { ChoiceBackendService } from './services/choice-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChoiceModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([ChoiceModel])],
  providers: [ChoiceBackendService],
  exports: [ChoiceBackendService],
})
export class ChoiceBackendServiceModule {}
