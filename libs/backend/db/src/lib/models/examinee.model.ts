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
import { DataTypes } from 'sequelize';
import { ExamineeGroupModel } from './examinee-group.model';
import { InstitutionModel } from './institution.model';
import { UserModel } from './user.model';

@Table({
  tableName: 'examinees',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class ExamineeModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @ForeignKey(() => InstitutionModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  institutionId?: string;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  createdById?: string;

  @BelongsTo(() => UserModel)
  createdBy!: UserModel;

  @Column({ type: DataTypes.STRING, unique: true, allowNull: false })
  uniqueIdentifier!: string;

  @Column({ type: DataTypes.JSON, allowNull: false })
  otherDetails!: Record<string, string>;

  @BelongsToMany(() => ExamineeGroupModel, {
    foreignKeyConstraint: true,
    through: 'examinee_examinee_group',
    foreignKey: 'examinee_id',
    otherKey: 'examinee_group_id',
  })
  examineeGroups!: ExamineeGroupModel[];
}
