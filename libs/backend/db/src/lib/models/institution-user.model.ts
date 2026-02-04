import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { DataTypes } from 'sequelize';
import { InstitutionModel } from './institution.model';
import { UserModel } from './user.model';

@Table({
  tableName: 'institution_user',
  underscored: true,
  paranoid: false,
  timestamps: true,
  deletedAt: false,
})
export class InstitutionUserModel extends Model {
  @ForeignKey(() => InstitutionModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  institutionId!: string;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @ForeignKey(() => UserModel)
  @Column({ type: DataTypes.UUID, allowNull: false })
  userId!: string;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @Column({
    type: DataTypes.ENUM('Owner', 'Admin', 'Examiner'),
    allowNull: false,
  })
  userRole!: 'Owner' | 'Admin' | 'Examiner';
}
