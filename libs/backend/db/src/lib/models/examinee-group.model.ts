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
import { ExamineeModel } from './examinee.model';
import { InstitutionModel } from './institution.model';
import { DataTypes } from 'sequelize';
import { UserModel } from './user.model';

@Table({
  tableName: 'examinee_groups',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class ExamineeGroupModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @Column
  name?: string;

  @BelongsToMany(() => ExamineeModel, {
    foreignKeyConstraint: true,
    through: 'examinee_examinee_group',
    foreignKey: 'examinee_group_id',
    otherKey: 'examinee_id',
  })
  examinees!: ExamineeModel[];

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
}
