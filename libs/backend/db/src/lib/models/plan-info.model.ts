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
import { PlanModel } from './plan.model';

@Table({
  tableName: 'plan_infos',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class PlanInfoModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @ForeignKey(() => PlanModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  planId!: string;

  @BelongsTo(() => PlanModel)
  plan!: PlanModel;
}
