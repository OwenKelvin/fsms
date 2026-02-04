import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { ExamineeGroupModel, ExamineeModel, UserModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';
import { validateUUID } from '@fsms/backend/util';

interface ExamineeInput {
  id?: string;
  uniqueIdentifier?: string;
  otherDetails?: {
    firstName?: string;
    lastNane?: string;
  };
}

@Injectable()
export class ExamineeGroupBackendService extends CrudAbstractService<ExamineeGroupModel> {
  constructor(
    @InjectModel(ExamineeGroupModel)
    private examineeGroupModel: typeof ExamineeGroupModel,
    @InjectModel(ExamineeModel)
    private examineeModel: typeof ExamineeModel,
  ) {
    super(examineeGroupModel);
  }

  async saveExaminees(
    examineeGroup: ExamineeGroupModel,
    createdBy: UserModel,
    examineeInputs: ExamineeInput[] = [],
  ) {
    const examineeGroupIds: string[] = [];
    for (let i = 0; i < examineeInputs.length; i++) {
      const examineeInput = examineeInputs[i];
      if (examineeInput.id) {
        validateUUID(examineeInput.id, 'examineeId');
        examineeGroupIds.push(examineeInput.id as string);
      } else if (examineeInputs[i].uniqueIdentifier) {
        const [createdExaminee] = await this.examineeModel.findOrCreate({
          where: {
            uniqueIdentifier: examineeInput.uniqueIdentifier,
            institutionId: examineeGroup.institutionId,
          },
          defaults: {
            otherDetails: examineeInput.otherDetails,
            createdById: createdBy.id,
          },
        });
        examineeGroupIds.push(createdExaminee.id);
      }
    }

    await examineeGroup.$set('examinees', examineeGroupIds);
  }
}
