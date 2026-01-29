import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'payments',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class PaymentModel extends Model {
  @Column
  name?: string;
}
