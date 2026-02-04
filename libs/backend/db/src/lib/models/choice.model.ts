import {
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { QuestionModel } from './question.model';
import { UserModel } from './user.model';

@Table({
  tableName: 'choices',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class ChoiceModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @ForeignKey(() => QuestionModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  questionId!: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  createdById?: string;

  @BelongsTo(() => UserModel)
  createdBy!: UserModel;

  @BelongsTo(() => QuestionModel)
  question!: QuestionModel;

  @Column({ type: DataTypes.STRING })
  description?: string;

  @Column({ type: DataTypes.BOOLEAN })
  isCorrectChoice!: boolean;
}
