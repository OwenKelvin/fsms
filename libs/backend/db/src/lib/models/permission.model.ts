import { BelongsToMany, Column, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { RoleModel } from './role.model';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'permissions',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class PermissionModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  name?: string;

  @BelongsToMany(() => RoleModel, {
    foreignKeyConstraint: true,
    through: 'permission_role',
    foreignKey: 'permission_id',
    otherKey: 'role_id',
  })
  roles!: RoleModel[];
}
