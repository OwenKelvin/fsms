import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DataTypes } from 'sequelize';
import { ExamModel } from './exam.model';
import { TagModel } from './tag.model';

@Table({
  tableName: 'exam_tag',
  underscored: true,
  paranoid: false,
  timestamps: true,
  deletedAt: false,
})
export class ExamTagModel extends Model {
  @ForeignKey(() => ExamModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  examId!: number;

  exam!: ExamModel;

  @ForeignKey(() => TagModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  tagId!: number;

  tag!: TagModel;
}
