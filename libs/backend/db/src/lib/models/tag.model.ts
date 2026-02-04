import {
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import { DataTypes } from 'sequelize';
import { InstitutionModel } from './institution.model';

@Table({
  tableName: 'tags',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class TagModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @Column({ type: DataTypes.STRING })
  name?: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  createdById?: string;

  @BelongsTo(() => UserModel)
  createdBy!: UserModel;

  @ForeignKey(() => InstitutionModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  institutionId?: string;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;
}
