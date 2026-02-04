import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@fsms/backend/crud-abstract';
import {
  ChoiceModel,
  QuestionModel,
  QuestionTagModel,
  TagModel,
} from '@fsms/backend/db';
import { InjectModel } from '@nestjs/sequelize';

interface QuestionChoice {
  description: string;
  isCorrectChoice: boolean;
}

@Injectable()
export class QuestionBackendService extends CrudAbstractService<QuestionModel> {
  constructor(
    @InjectModel(QuestionModel) private questionModel: typeof QuestionModel,
    @InjectModel(ChoiceModel) private choiceModel: typeof ChoiceModel,
    @InjectModel(QuestionTagModel)
    private questionTagModel: typeof QuestionTagModel,
    @InjectModel(TagModel) private tagModel: typeof TagModel,
  ) {
    super(questionModel);
  }

  async saveChoices({
    questionId,
    choices,
    createdById,
  }: {
    questionId: number;
    choices: QuestionChoice[];
    createdById: number;
  }) {
    const dataToInsert = choices.map((choice) => ({
      questionId,
      createdById,
      ...choice,
    }));
    await this.choiceModel.bulkCreate(dataToInsert);
  }

  async setTags(
    question: QuestionModel,
    inputTags: {
      institutionId: number;
      id?: number;
      name?: string;
      createdById: number;
    }[],
  ) {
    const existingTags = await this.questionTagModel.findAll({
      where: { questionId: question.id },
    });

    for (const tag of inputTags) {
      if (tag.id) {
        // Check if the tag is already associated
        const existingTag = existingTags.find((t) => t.tagId === tag.id);
        if (!existingTag) {
          // Associate the tag with the question if it's not already associated
          await this.questionTagModel.create({
            questionId: question.id,
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

        await this.questionTagModel.create({
          questionId: question.id,
          tagId: newTag.id,
        });
      }
    }
  }
}
