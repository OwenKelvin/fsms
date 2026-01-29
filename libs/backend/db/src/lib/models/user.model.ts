import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { RoleModel } from './role.model';
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
