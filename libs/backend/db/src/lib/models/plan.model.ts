import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { PlanInfoModel } from './plan-info.model';

@Table({
  tableName: 'plans',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class PlanModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'tag_line',
  })
  tagLine!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'cost_per_credit_in_kes',
  })
  costPerCreditInKES!: number;

  @HasMany(() => PlanInfoModel)
  planInfos!: PlanInfoModel[];
}
