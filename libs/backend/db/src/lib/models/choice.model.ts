import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
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
  @ForeignKey(() => QuestionModel)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  questionId!: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  createdById?: number;

  @BelongsTo(() => UserModel)
  createdBy!: UserModel;

  @BelongsTo(() => QuestionModel)
  question!: QuestionModel;

  @Column({ type: DataTypes.STRING })
  description?: string;

  @Column({ type: DataTypes.BOOLEAN })
  isCorrectChoice!: boolean;
}
