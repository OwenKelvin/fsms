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
    userId: number;
    userRole: 'Owner' | 'Admin' | 'Examiner';
    institutionId: number;
  }) {
    await this.institutionUserModel.create({ ...param });
  }

  async allocateFreeCredits(institutionId: number) {
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
