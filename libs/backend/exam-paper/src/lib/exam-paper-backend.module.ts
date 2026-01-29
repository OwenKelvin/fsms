import { Module } from '@nestjs/common';
import { ExamPaperModelEventsListener } from './listeners/exam-paper-model-events-listener.service';
import { ExamPaperBackendServiceModule } from '@fsms/backend/exam-paper-backend-service';
import { ExamPaperResolver } from './resolvers/exam-paper.resolver';
import { ExamServiceModule } from '@fsms/backend/exam-service';
import { InstitutionBackendServiceModule } from '@fsms/backend/institution-backend-service';
import { AuthServiceBackendModule } from '@fsms/backend/auth-service';

@Module({
  imports: [
    ExamPaperBackendServiceModule,
    ExamServiceModule,
    InstitutionBackendServiceModule,
    AuthServiceBackendModule,
  ],
  providers: [ExamPaperResolver, ExamPaperModelEventsListener],
  exports: [],
})
export class ExamPaperModule {}
