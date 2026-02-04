import { Column, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'payments',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class PaymentModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @Column
  name?: string;
}
