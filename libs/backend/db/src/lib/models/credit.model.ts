import {
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { InstitutionModel } from './institution.model';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'credits',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class CreditModel extends Model {
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  @Column(DataTypes.UUID)
  override id!: string;

  @ForeignKey(() => InstitutionModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  institutionId?: string;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @Column({ type: DataTypes.INTEGER, allowNull: true })
  balance?: number;
}
