import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import { TagModel } from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TagBackendService extends CrudAbstractService<TagModel> {
  constructor(@InjectModel(TagModel) private tagModel: typeof TagModel) {
    super(tagModel);
  }
}
