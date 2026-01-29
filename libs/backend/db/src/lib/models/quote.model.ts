import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { InstitutionModel } from './institution.model';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'quotes',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class QuoteModel extends Model {
  @ForeignKey(() => InstitutionModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  institutionId?: number;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  planId!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expireAt?: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  creditCost!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  creditAmount!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  totalCost!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  feeCost!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  taxCost!: number;
}
