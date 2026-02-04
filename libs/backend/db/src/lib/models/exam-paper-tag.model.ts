import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { DataTypes } from 'sequelize';
import { TagModel } from './tag.model';
import { ExamPaperModel } from './exam-paper.model';

@Table({
  tableName: 'exam_paper_tag',
  underscored: true,
  paranoid: false,
  timestamps: true,
  deletedAt: false,
})
export class ExamPaperTagModel extends Model {
  @ForeignKey(() => ExamPaperModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  examPaperId!: string;

  @BelongsTo(() => ExamPaperModel)
  examPaper!: ExamPaperModel;

  @ForeignKey(() => TagModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  tagId!: string;

  @BelongsTo(() => TagModel)
  tag!: TagModel;
}
