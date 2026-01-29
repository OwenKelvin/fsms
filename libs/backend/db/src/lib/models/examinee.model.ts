import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
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
  @ForeignKey(() => InstitutionModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  institutionId?: number;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  createdById?: number;

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
