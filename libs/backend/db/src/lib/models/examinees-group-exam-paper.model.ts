import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { DataTypes } from 'sequelize';
import { ExamPaperModel } from './exam-paper.model';
import { ExamineeGroupModel } from './examinee-group.model';

@Table({
  tableName: 'exam_paper_tag',
  underscored: true,
  paranoid: false,
  timestamps: true,
  deletedAt: false,
})
export class ExamineesGroupExamPaperModel extends Model {
  @ForeignKey(() => ExamPaperModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  examPaperId!: number;

  @BelongsTo(() => ExamPaperModel)
  examPaper!: ExamPaperModel;

  @ForeignKey(() => ExamineeGroupModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  examineeGroupId!: number;

  @BelongsTo(() => ExamineeGroupModel)
  examineeGroup!: ExamineeGroupModel;
}
