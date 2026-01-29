import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { QuoteModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class QuoteBackendService extends CrudAbstractService<QuoteModel> {
  constructor(@InjectModel(QuoteModel) private quoteModel: typeof QuoteModel) {
    super(quoteModel);
  }
}
