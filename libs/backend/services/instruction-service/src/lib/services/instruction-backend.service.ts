import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { InstructionModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class InstructionBackendService extends CrudAbstractService<InstructionModel> {
  constructor(
    @InjectModel(InstructionModel)
    private instructionModel: typeof InstructionModel,
  ) {
    super(instructionModel);
  }
}
