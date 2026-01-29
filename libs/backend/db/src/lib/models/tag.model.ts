import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import { DataTypes } from 'sequelize';
import { InstitutionModel } from './institution.model';

@Table({
  tableName: 'tags',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class TagModel extends Model {
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

  @ForeignKey(() => InstitutionModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  institutionId?: number;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;
}
