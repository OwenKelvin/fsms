import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { DataTypes } from 'sequelize';
import { ExamPaperModel } from './exam-paper.model';
import { ConfigModel } from './config.model';

@Table({
  tableName: 'config_exam_paper',
  underscored: true,
  paranoid: false,
  timestamps: true,
  deletedAt: false,
})
export class ConfigExamPaperModel extends Model {
  @ForeignKey(() => ExamPaperModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  examPaperId!: number;

  @BelongsTo(() => ExamPaperModel)
  examPaper!: ExamPaperModel;

  @ForeignKey(() => ConfigModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  configId!: number;

  @BelongsTo(() => ConfigModel)
  config!: ConfigModel;

  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
  selected?: string;

  @Column({ type: DataTypes.STRING, allowNull: true })
  value?: string;
}
