import {
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { ChoiceModel } from './choice.model';
import { ExamPaperModel } from './exam-paper.model';
import { UserModel } from './user.model';
import { TagModel } from './tag.model';

@Table({
  tableName: 'questions',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class QuestionModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  createdById?: string;

  @BelongsTo(() => UserModel)
  createdBy!: UserModel;

  @Column({ type: DataTypes.TEXT, allowNull: false })
  description?: string;

  @Column({ type: DataTypes.TEXT, allowNull: true })
  correctChoiceExplanation?: string;

  @ForeignKey(() => ExamPaperModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  examPaperId!: string;

  @BelongsTo(() => ExamPaperModel)
  examPaper!: ExamPaperModel;

  @Column({
    type: DataTypes.ENUM('CheckBox', 'Radio', 'Input'),
    allowNull: true,
  })
  choiceType?: 'CheckBox' | 'Radio' | 'Input';

  @Column({ type: DataTypes.BOOLEAN, allowNull: true })
  autoMark?: boolean;

  @HasMany(() => ChoiceModel)
  choices!: ChoiceModel[];

  @BelongsToMany(() => TagModel, {
    foreignKeyConstraint: true,
    through: 'question_tag',
    foreignKey: 'question_id',
    otherKey: 'tag_id',
  })
  tags!: TagModel[];
}
