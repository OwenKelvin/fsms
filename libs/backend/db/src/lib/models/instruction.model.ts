import {
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
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
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @ForeignKey(() => ExamPaperModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  examPaperId!: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  description?: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  createdById?: string;

  @BelongsTo(() => UserModel)
  createdBy!: UserModel;
}
