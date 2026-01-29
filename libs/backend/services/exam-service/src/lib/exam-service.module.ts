import { Module } from '@nestjs/common';
import { ExamService } from './services/exam.service';
import {
  ConfigExamModel,
  ExamModel,
  ExamPaperModel,
  ExamTagModel,
  TagModel,
} from '@fsms/backend/db';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ExamModel,
      ExamTagModel,
      ConfigExamModel,
      TagModel,
      ExamPaperModel,
    ]),
  ],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamServiceModule {}
