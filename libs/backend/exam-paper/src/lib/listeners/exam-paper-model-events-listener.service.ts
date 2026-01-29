import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ExamPaperEvent } from '../events/exam-paper-created.event';
import { ActivityLogBackendService } from '@fsms/backend/activity-log-backend-service';
import { ExamPaperBackendService } from '@fsms/backend/exam-paper-backend-service';
import { ExamineeGroupModel, ExamineeModel } from '@fsms/backend/db';

@Injectable()
export class ExamPaperModelEventsListener {
  constructor(
    private activityLogService: ActivityLogBackendService,
    private examPaperService: ExamPaperBackendService,
  ) {}

  @OnEvent('exam-paper.created')
  async handleExamPaperCreated($event: ExamPaperEvent) {
    await this.activityLogService.create({
      userId: $event.examPaper.createdById,
      action: 'exam-paper.created',
      description: 'Exam paper created',
      type: 'SUCCESS',
    });
  }

  @OnEvent('exam-paper.published')
  async handleExamPublished($event: ExamPaperEvent) {
    await this.activityLogService.create({
      userId: $event.examPaper.createdById,
      action: 'exam-paper.published',
      description: 'Exam paper published',
      type: 'SUCCESS',
    });

    const examPaper = await this.examPaperService.model.findByPk(
      $event.examPaper.id,
      {
        include: [{ model: ExamineeGroupModel, include: [ExamineeModel] }],
      },
    );

    examPaper?.examineeGroups?.forEach((examineeGroup) => {
      examineeGroup.examinees.forEach((examinee) => {
        console.log(examinee.id);
      });
    });
  }
}
