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
import { TagModel } from './tag.model';
import { DataTypes } from 'sequelize';
import { ConfigModel } from './config.model';
import { UserModel } from './user.model';
import { InstitutionModel } from './institution.model';
import { ExamPaperModel } from './exam-paper.model';

@Table({
  tableName: 'exams',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class ExamModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  name?: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  createdById?: string;

  @BelongsTo(() => UserModel)
  createdBy!: UserModel;

  @ForeignKey(() => InstitutionModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  institutionId?: string;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @Column({ type: DataTypes.DATE, allowNull: true })
  startDate?: Date | null;

  @Column({ type: DataTypes.DATE, allowNull: true })
  endDate?: Date | null;

  @BelongsToMany(() => TagModel, {
    foreignKeyConstraint: true,
    through: 'exam_tag',
    foreignKey: 'exam_id',
    otherKey: 'tag_id',
  })
  tags!: TagModel[];

  @HasMany(() => ExamPaperModel)
  examPapers?: ExamPaperModel[];

  @BelongsToMany(() => ConfigModel, {
    foreignKeyConstraint: true,
    through: 'config_exam',
    foreignKey: 'exam_id',
    otherKey: 'config_id',
  })
  configs?: ConfigModel[];
}
