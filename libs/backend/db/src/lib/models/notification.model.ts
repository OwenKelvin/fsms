import { Column, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'notifications',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class NotificationModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  title?: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  description?: string;
}
