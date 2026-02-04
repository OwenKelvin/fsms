import { Column, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'otps',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class OtpModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @Column
  identifier?: string;

  @Column
  token?: string;

  @Column
  validity?: number;

  @Column
  usage?: string;

  @Column
  valid?: boolean;
}
