import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DataTypes } from 'sequelize';
import { ExamModel } from './exam.model';
import { ConfigModel } from './config.model';

@Table({
  tableName: 'config_exam',
  underscored: true,
  paranoid: false,
  timestamps: true,
  deletedAt: false,
})
export class ConfigExamModel extends Model {
  @ForeignKey(() => ExamModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  examId!: string;

  exam!: ExamModel;

  @ForeignKey(() => ConfigModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  configId!: string;

  config!: ConfigModel;

  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
  selected?: string;

  @Column({ type: DataTypes.STRING, allowNull: true })
  value?: string;
}
