import { Module } from '@nestjs/common';
import { InstructionBackendService } from './services/instruction-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { InstructionModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([InstructionModel])],
  providers: [InstructionBackendService],
  exports: [InstructionBackendService],
})
export class InstructionBackendServiceModule {}
