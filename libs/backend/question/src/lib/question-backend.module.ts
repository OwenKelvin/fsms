import { Module } from '@nestjs/common';
import { QuestionModelEventsListener } from './listeners/question-model-events-listener.service';
import { QuestionBackendServiceModule } from '@fsms/backend/question-backend-service';
import { QuestionResolver } from './resolvers/question.resolver';
import { ChoiceBackendServiceModule } from '@fsms/backend/choice-backend-service';
import { InstitutionBackendServiceModule } from '@fsms/backend/institution-backend-service';
import { AuthServiceBackendModule } from '@fsms/backend/auth-service';

@Module({
  imports: [
    QuestionBackendServiceModule,
    ChoiceBackendServiceModule,
    InstitutionBackendServiceModule,
    AuthServiceBackendModule,
  ],
  providers: [QuestionResolver, QuestionModelEventsListener],
  exports: [],
})
export class QuestionModule {}
