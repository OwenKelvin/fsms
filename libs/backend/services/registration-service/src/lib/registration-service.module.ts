import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { 
  UserModel, 
  InstitutionModel, 
  JobTitleModel, 
  RegistrationRecordModel,
  RegistrationStatusHistoryModel,
  RegistrationDocumentModel,
  FileUploadModel
} from '@fsms/backend/db';
import { FileUploadModule } from '@fsms/backend/file-upload';
import { RegistrationService } from './services/registration.service';
import { DocumentService } from './services/document.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      InstitutionModel,
      JobTitleModel,
      RegistrationRecordModel,
      RegistrationStatusHistoryModel,
      RegistrationDocumentModel,
      FileUploadModel
    ]),
    FileUploadModule
  ],
  providers: [RegistrationService, DocumentService],
  exports: [RegistrationService, DocumentService],
})
export class RegistrationServiceModule {}