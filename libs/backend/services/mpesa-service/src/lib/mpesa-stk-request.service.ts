import { Injectable } from '@nestjs/common';

import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { MpesaStkRequestModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class MpesaStkRequestService extends CrudAbstractService<MpesaStkRequestModel> {
  constructor(
    @InjectModel(MpesaStkRequestModel)
    mpesaStkRequestModel: typeof MpesaStkRequestModel,
  ) {
    super(mpesaStkRequestModel);
  }

  findByMerchantRequestId(
    merchantRequestId: string,
    checkoutRequestId: string,
  ) {
    return this.repository.findOne({
      where: {
        merchantRequestId,
        checkoutRequestId,
      },
    });
  }
}
