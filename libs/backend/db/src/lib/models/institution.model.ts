import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UserModel } from './user.model';

@Table({
  tableName: 'institutions',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class InstitutionModel extends Model {
  @Column({ type: DataTypes.STRING })
  name?: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  createdById?: UserModel;

  @BelongsTo(() => UserModel)
  createdBy!: UserModel;
}
