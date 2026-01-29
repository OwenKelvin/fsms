import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
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
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @ForeignKey(() => PlanModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  planId!: number;

  @BelongsTo(() => PlanModel)
  plan!: PlanModel;
}
