import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

type ConfigTypeType = 'EXAM' | 'EXAM_PAPER';

@Table({
  tableName: 'configs',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class ConfigModel extends Model {
  @Column({ type: DataTypes.STRING })
  name?: string;

  @Column({ type: DataTypes.ENUM('EXAM', 'EXAM_PAPER') })
  type?: ConfigTypeType;
}
