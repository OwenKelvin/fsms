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
import { QuoteModel } from './quote.model';

@Table({
  tableName: 'transactions',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class TransactionModel extends Model {
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

  @ForeignKey(() => QuoteModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: true,
  })
  quoteId?: string;

  @BelongsTo(() => QuoteModel)
  quote!: QuoteModel;

  @Column({
    type: DataTypes.ENUM('purchase', 'exam', 'promotion'),
    allowNull: false,
  })
  type!: 'purchase' | 'exam' | 'promotion';

  @Column({ type: DataTypes.DOUBLE, allowNull: false })
  amount!: number;

  @Column({ type: DataTypes.DOUBLE, allowNull: false })
  balanceAfterTransaction!: number;

  @Column({ type: DataTypes.STRING, allowNull: false })
  description?: string;
}
