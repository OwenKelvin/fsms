import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import {
  ConfigExamPaperModel,
  ExamPaperModel,
  ExamPaperTagModel,
  TagModel,
} from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';
import { validateUUID } from '@fsms/backend/util';

@Injectable()
export class ExamPaperBackendService extends CrudAbstractService<ExamPaperModel> {
  constructor(
    @InjectModel(ExamPaperModel) examPaperModel: typeof ExamPaperModel,
    @InjectModel(ConfigExamPaperModel)
    private configExamPaperModel: typeof ConfigExamPaperModel,
    @InjectModel(ExamPaperTagModel)
    private examPaperTagModel: typeof ExamPaperTagModel,
    @InjectModel(TagModel) private tagModel: typeof TagModel,
  ) {
    super(examPaperModel);
  }

  async setConfigs(
    exam: ExamPaperModel,
    inputConfigs: { id: string; selected: boolean; value?: string }[],
  ) {
    const existingConfigs = await this.configExamPaperModel.findAll({
      where: { examPaperId: exam.id },
    });

    for (const config of inputConfigs) {
      validateUUID(config.id, 'configId');
      
      const existingConfig = existingConfigs.find(
        (c) => c.configId === config.id,
      );
      if (existingConfig) {
        await existingConfig.update({
          selected: config.selected,
          value: config.value ?? existingConfig.value,
        });
      } else {
        await this.configExamPaperModel.create({
          examPaperId: exam.id,
          configId: config.id,
          selected: config.selected,
          value: config.value,
        });
      }
    }
  }

  async setTags(
    exam: ExamPaperModel,
    inputTags: { id?: string; name?: string; createdById: string }[],
  ) {
    const existingTags = await this.examPaperTagModel.findAll({
      where: { examPaperId: exam.id },
    });

    for (const tag of inputTags) {
      validateUUID(tag.createdById, 'createdById');
      
      if (tag.id) {
        validateUUID(tag.id, 'tagId');
        
        // Check if the tag is already associated
        const existingTag = existingTags.find((t) => t.tagId === tag.id);
        if (!existingTag) {
          // Associate the tag with the exam if it's not already associated
          await this.examPaperTagModel.create({
            examPaperId: exam.id,
            tagId: tag.id,
          });
        }
      } else if (tag.name) {
        const [newTag] = await this.tagModel.findOrCreate({
          where: { name: tag.name, institutionId: exam.institutionId },
          defaults: {
            createdById: tag.createdById,
          },
        });

        await this.examPaperTagModel.create({
          examPaperId: exam.id,
          tagId: newTag.id,
        });
      }
    }
  }
}
