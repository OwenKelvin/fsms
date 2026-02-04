import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
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

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  planId!: string;

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
