import { Module } from '@nestjs/common';
import { ExamPaperBackendService } from './services/exam-paper-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ConfigExamPaperModel,
  ExamPaperModel,
  ExamPaperTagModel,
  TagModel,
} from '@fsms/backend/db';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ConfigExamPaperModel,
      ExamPaperModel,
      ExamPaperTagModel,
      TagModel,
    ]),
  ],
  providers: [ExamPaperBackendService],
  exports: [ExamPaperBackendService],
})
export class ExamPaperBackendServiceModule {}
