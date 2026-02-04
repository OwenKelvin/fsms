import {
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ExamModel } from './exam.model';
import { DataTypes } from 'sequelize';
import { UserModel } from './user.model';
import { TagModel } from './tag.model';
import { ConfigModel } from './config.model';
import { InstitutionModel } from './institution.model';
import { ExamineeGroupModel } from './examinee-group.model';

@Table({
  tableName: 'exam_papers',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class ExamPaperModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @Column({ type: DataTypes.STRING })
  name?: string;

  @Column({ type: DataTypes.DATE })
  paperDate?: string;

  @ForeignKey(() => ExamModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  examId?: string;

  @BelongsTo(() => ExamModel)
  exam!: ExamModel;

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

  @BelongsToMany(() => TagModel, {
    foreignKeyConstraint: true,
    through: 'exam_paper_tag',
    foreignKey: 'exam_paper_id',
    otherKey: 'tag_id',
  })
  tags!: TagModel[];

  @BelongsToMany(() => ConfigModel, {
    foreignKeyConstraint: true,
    through: 'config_exam_paper',
    foreignKey: 'exam_paper_id',
    otherKey: 'config_id',
  })
  configs?: ConfigModel[];

  @BelongsToMany(() => ExamineeGroupModel, {
    foreignKeyConstraint: true,
    through: 'examinee_group_exam_paper',
    foreignKey: 'exam_paper_id',
    otherKey: 'examinee_group_id',
  })
  examineeGroups?: ExamineeGroupModel[];

  @Column({ type: DataTypes.DATE })
  publishedAt?: Date | null = null;
}
