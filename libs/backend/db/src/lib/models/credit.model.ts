import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { InstitutionModel } from './institution.model';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'credits',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class CreditModel extends Model {
  @ForeignKey(() => InstitutionModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  institutionId?: number;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @Column({ type: DataTypes.INTEGER, allowNull: true })
  balance?: number;
}
