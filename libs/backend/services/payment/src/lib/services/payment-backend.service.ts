import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { PaymentModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PaymentBackendService extends CrudAbstractService<PaymentModel> {
  constructor(
    @InjectModel(PaymentModel) private paymentModel: typeof PaymentModel,
  ) {
    super(paymentModel);
  }
}
