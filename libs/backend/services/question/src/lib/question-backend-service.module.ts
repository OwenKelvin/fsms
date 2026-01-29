import { Module } from '@nestjs/common';
import { QuestionBackendService } from './services/question-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ChoiceModel,
  QuestionModel,
  QuestionTagModel,
  TagModel,
} from '@fsms/backend/db';

@Module({
  imports: [
    SequelizeModule.forFeature([
      QuestionModel,
      ChoiceModel,
      QuestionTagModel,
      TagModel,
    ]),
  ],
  providers: [QuestionBackendService],
  exports: [QuestionBackendService],
})
export class QuestionBackendServiceModule {}
