import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
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
  @ForeignKey(() => InstitutionModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  institutionId?: number;

  @BelongsTo(() => InstitutionModel)
  institution!: InstitutionModel;

  @ForeignKey(() => QuoteModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
  })
  quoteId?: number;

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
