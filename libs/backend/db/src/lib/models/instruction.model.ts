import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ExamPaperModel } from './exam-paper.model';
import { DataTypes } from 'sequelize';
import { UserModel } from './user.model';

@Table({
  tableName: 'instructions',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class InstructionModel extends Model {
  @ForeignKey(() => ExamPaperModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  examPaperId!: number;

  @Column({ type: DataTypes.STRING, allowNull: false })
  description?: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  createdById?: number;

  @BelongsTo(() => UserModel)
  createdBy!: UserModel;
}
