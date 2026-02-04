import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { InstitutionModel } from './institution.model';
import { QuoteModel } from './quote.model';

@Table({
  tableName: 'mpesa_stk_requests',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class MpesaStkRequestModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string;

  @ForeignKey(() => InstitutionModel)
  @Column(DataType.UUID)
  institutionId?: string;

  @BelongsTo(() => InstitutionModel)
  institution?: InstitutionModel;

  @Column
  merchantRequestId?: string;

  @Column
  checkoutRequestId?: string;

  @ForeignKey(() => QuoteModel)
  @Column(DataType.UUID)
  quoteId?: string;

  @BelongsTo(() => QuoteModel)
  quote?: QuoteModel;

  @Column
  responseCode?: string;

  @Column
  responseDescription?: string;

  @Column
  customerMessage?: string;
}
