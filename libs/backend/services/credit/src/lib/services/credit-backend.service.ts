import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { CreditModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CreditBackendService extends CrudAbstractService<CreditModel> {
  constructor(
    @InjectModel(CreditModel) private creditModel: typeof CreditModel,
  ) {
    super(creditModel);
  }
}
