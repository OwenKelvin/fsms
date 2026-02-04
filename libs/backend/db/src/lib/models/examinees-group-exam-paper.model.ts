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
  @Column({ type: DataTypes.UUID, allowNull: false })
  examPaperId!: string;

  @BelongsTo(() => ExamPaperModel)
  examPaper!: ExamPaperModel;

  @ForeignKey(() => ExamineeGroupModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  examineeGroupId!: string;

  @BelongsTo(() => ExamineeGroupModel)
  examineeGroup!: ExamineeGroupModel;
}
