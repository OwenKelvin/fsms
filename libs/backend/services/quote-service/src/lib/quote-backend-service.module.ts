import { Module } from '@nestjs/common';
import { QuoteBackendService } from './services/quote-backend.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { QuoteModel } from '@fsms/backend/db';

@Module({
  imports: [SequelizeModule.forFeature([QuoteModel])],
  providers: [QuoteBackendService],
  exports: [QuoteBackendService],
})
export class QuoteBackendServiceModule {}
