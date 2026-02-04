import {
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import { ActivityLogUserModel } from './activity-log-user.model';

@Table({
  tableName: 'activity_logs',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class ActivityLogModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  action?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @BelongsToMany(() => UserModel, () => ActivityLogUserModel)
  users!: UserModel[];

  @Column({
    type: DataType.ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS'),
    allowNull: true,
  })
  type?: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
}
