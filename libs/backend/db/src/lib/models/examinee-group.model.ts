import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
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
}
