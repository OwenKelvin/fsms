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
    inputConfigs: { configId: number; selected: boolean; value?: string }[],
  ) {
    const existingConfigs = await this.configExamModel.findAll({
      where: { examId: exam.id },
    });

    for (const config of inputConfigs) {
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
      institutionId: number;
      id?: number;
      name?: string;
      createdById: number;
    }[],
  ) {
    const existingTags = await this.examTagModel.findAll({
      where: { examId: exam.id },
    });

    for (const tag of inputTags) {
      if (tag.id) {
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

  async findExamPapers(examId: number, limit = 5, offset = 0) {
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
