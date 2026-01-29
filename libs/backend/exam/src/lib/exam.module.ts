import { Module } from '@nestjs/common';
import { ExamResolver } from './resolvers/exam.resolver';
import { ExamServiceModule } from '@fsms/backend/exam-service';
import { InstitutionBackendServiceModule } from '@fsms/backend/institution-backend-service';
import { UserServiceModule } from '@fsms/backend/user-service';
import { AuthServiceBackendModule } from '@fsms/backend/auth-service';

@Module({
  imports: [
    ExamServiceModule,
    InstitutionBackendServiceModule,
    UserServiceModule,
    AuthServiceBackendModule,
  ],
  providers: [ExamResolver],
  exports: [],
})
export class ExamModule {}
