import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { TransactionModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TransactionBackendService extends CrudAbstractService<TransactionModel> {
  constructor(
    @InjectModel(TransactionModel)
    private transactionModel: typeof TransactionModel,
  ) {
    super(transactionModel);
  }
}
