import { Column, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'settings',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class SettingModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  value!: string;
}
