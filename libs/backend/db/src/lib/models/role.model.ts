import { BelongsToMany, Column, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { PermissionModel } from './permission.model';
import { UserModel } from './user.model';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'roles',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class RoleModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  id!: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  name?: string;

  @BelongsToMany(() => PermissionModel, {
    foreignKeyConstraint: true,
    through: 'permission_role',
    foreignKey: 'role_id',
    otherKey: 'permission_id',
  })
  permissions!: PermissionModel[];

  @BelongsToMany(() => UserModel, {
    foreignKeyConstraint: true,
    through: 'role_user',
    foreignKey: 'role_id',
    otherKey: 'user_id',
  })
  users!: UserModel[];
}
