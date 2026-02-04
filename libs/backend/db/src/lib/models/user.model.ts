import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { RoleModel } from './role.model';
import { JobTitleModel } from './job-title.model';
import { DataTypes } from 'sequelize';
import { ActivityLogUserModel } from './activity-log-user.model';

@Table({
  tableName: 'users',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class UserModel extends Model {
  @Column({ allowNull: false })
  username?: string;

  @Column({ allowNull: false })
  firstName?: string;

  @Column({ allowNull: false })
  lastName?: string;

  @Column({ unique: true, allowNull: false })
  email?: string;

  @Column({ type: DataTypes.STRING, allowNull: true })
  phone?: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  password?: string;

  @Column({ type: DataTypes.DATE })
  emailVerifiedAt?: Date;

  @Column({ type: DataTypes.DATE })
  phoneVerifiedAt?: string;

  @Column({ type: DataTypes.STRING, allowNull: true })
  profilePhotoLink?: string;

  @Column({ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false })
  twoFactorEnabled?: boolean;

  @Column({ type: DataTypes.STRING, allowNull: true })
  twoFactorSecret?: string;

  @Column({ type: DataTypes.TEXT, allowNull: true })
  twoFactorBackupCodes?: string;

  @ForeignKey(() => JobTitleModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
  })
  jobTitleId?: number;

  @BelongsTo(() => JobTitleModel)
  jobTitle?: JobTitleModel;

  @BelongsToMany(() => RoleModel, {
    foreignKeyConstraint: true,
    through: 'role_user',
    foreignKey: 'user_id',
    otherKey: 'role_id',
  })
  roles!: RoleModel[];

  @BelongsToMany(() => UserModel, () => ActivityLogUserModel)
  users!: UserModel[];
}
