import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DataTypes } from 'sequelize';
import { TagModel } from './tag.model';
import { QuestionModel } from './question.model';

@Table({
  tableName: 'question_tag',
  underscored: true,
  paranoid: false,
  timestamps: true,
  deletedAt: false,
})
export class QuestionTagModel extends Model {
  @ForeignKey(() => QuestionModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  questionId!: string;

  question!: QuestionModel;

  @ForeignKey(() => TagModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  tagId!: string;

  tag!: TagModel;
}
