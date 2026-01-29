import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { ChoiceModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ChoiceBackendService extends CrudAbstractService<ChoiceModel> {
  constructor(
    @InjectModel(ChoiceModel) private choiceModel: typeof ChoiceModel,
  ) {
    super(choiceModel);
  }

  async findChoicesByQuestionId(questionId: number) {
    return this.choiceModel.findAll({ where: { questionId } });
  }
}
