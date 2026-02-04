import { Inject, Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { InstitutionModel, InstitutionUserModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';
import {
  SettingBackendService,
  SettingEnum,
} from '@fsms/backend/setting-backend-service';
import { TransactionBackendService } from '@fsms/backend/transaction-backend-service';
import { Sequelize } from 'sequelize-typescript';
import { CreditBackendService } from '@fsms/backend/credit-backend-service';
import { validateUUID } from '@fsms/backend/util';

@Injectable()
export class InstitutionBackendService extends CrudAbstractService<InstitutionModel> {
  constructor(
    @Inject(Sequelize)
    private readonly sequelize: Sequelize,
    @InjectModel(InstitutionModel)
    institutionModel: typeof InstitutionModel,
    @InjectModel(InstitutionUserModel)
    private institutionUserModel: typeof InstitutionUserModel,
    private settingService: SettingBackendService,
    private transactionService: TransactionBackendService,
    private creditService: CreditBackendService,
  ) {
    super(institutionModel);
  }

  async addUser(param: {
    userId: string;
    userRole: 'Owner' | 'Admin' | 'Examiner';
    institutionId: string;
  }) {
    validateUUID(param.userId, 'userId');
    validateUUID(param.institutionId, 'institutionId');
    await this.institutionUserModel.create({ ...param });
  }

  async allocateFreeCredits(institutionId: string) {
    validateUUID(institutionId, 'institutionId');
    
    const transaction = await this.sequelize.transaction();
    const initialCreditAllocation = await this.settingService.getByName(
      SettingEnum.initialFreeCredit,
    );
    try {
      const [credit] = await this.creditService.model.findOrCreate({
        where: { institutionId },
        defaults: { balance: 0 },
        transaction,
      });

      const balanceAfterTransaction =
        (credit.balance as number) + Number(initialCreditAllocation.value);

      await this.transactionService.model.create(
        {
          institutionId,
          type: 'promotion',
          amount: Number(initialCreditAllocation.value),
          balanceAfterTransaction,
          description: 'Free initial credit',
        },
        { transaction },
      );

      credit.balance = balanceAfterTransaction;
      await credit.save({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
