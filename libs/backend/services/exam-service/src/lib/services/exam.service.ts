import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import {
  ConfigExamModel,
  ExamModel,
  ExamPaperModel,
  ExamTagModel,
  TagModel,
} from '@fsms/backend/db';
import { validateUUID } from '@fsms/backend/util';

@Injectable()
export class ExamService extends CrudAbstractService<ExamModel> {
  constructor(
    @InjectModel(ExamModel) private examModel: typeof ExamModel,
    @InjectModel(ConfigExamModel)
    private configExamModel: typeof ConfigExamModel,
    @InjectModel(ExamTagModel) private examTagModel: typeof ExamTagModel,
    @InjectModel(TagModel) private tagModel: typeof TagModel,
    @InjectModel(ExamPaperModel) private examPaperModel: typeof ExamPaperModel,
  ) {
    super(examModel);
  }

  async setConfigs(
    exam: ExamModel,
    inputConfigs: { configId: string; selected: boolean; value?: string }[],
  ) {
    const existingConfigs = await this.configExamModel.findAll({
      where: { examId: exam.id },
    });

    for (const config of inputConfigs) {
      validateUUID(config.configId, 'configId');
      
      const existingConfig = existingConfigs.find(
        (c) => c.configId === config.configId,
      );
      if (existingConfig) {
        await existingConfig.update({
          selected: config.selected,
          value: config.value ?? existingConfig.value,
        });
      } else {
        await this.configExamModel.create({
          examId: exam.id,
          configId: config.configId,
          selected: config.selected,
          value: config.value,
        });
      }
    }
  }

  async setTags(
    exam: ExamModel,
    inputTags: {
      institutionId: string;
      id?: string;
      name?: string;
      createdById: string;
    }[],
  ) {
    const existingTags = await this.examTagModel.findAll({
      where: { examId: exam.id },
    });

    for (const tag of inputTags) {
      validateUUID(tag.institutionId, 'institutionId');
      validateUUID(tag.createdById, 'createdById');
      
      if (tag.id) {
        validateUUID(tag.id, 'tagId');
        
        // Check if the tag is already associated
        const existingTag = existingTags.find((t) => t.tagId === tag.id);
        if (!existingTag) {
          // Associate the tag with the exam if it's not already associated
          await this.examTagModel.create({
            examId: exam.id,
            tagId: tag.id,
          });
        }
      } else if (tag.name) {
        const [newTag] = await this.tagModel.findOrCreate({
          where: { name: tag.name, institutionId: tag.institutionId },
          defaults: {
            createdById: tag.createdById,
            institutionId: tag.institutionId,
          },
        });

        await this.examTagModel.create({
          examId: exam.id,
          tagId: newTag.id,
        });
      }
    }
  }

  async findExamPapers(examId: string, limit = 5, offset = 0) {
    validateUUID(examId, 'examId');
    
    const examPapers = await this.examPaperModel.findAll({
      where: {
        examId,
      },
      limit,
      offset,
    });

    return examPapers;
  }
}
