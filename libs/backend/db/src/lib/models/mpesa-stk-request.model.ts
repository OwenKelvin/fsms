import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
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
  @ForeignKey(() => InstitutionModel)
  @Column
  institutionId?: string;

  @BelongsTo(() => InstitutionModel)
  institution?: InstitutionModel;

  @Column
  merchantRequestId?: string;

  @Column
  checkoutRequestId?: string;

  @ForeignKey(() => QuoteModel)
  @Column
  quoteId?: number;

  @BelongsTo(() => QuoteModel)
  quote?: QuoteModel;

  @Column
  responseCode?: string;

  @Column
  responseDescription?: string;

  @Column
  customerMessage?: string;
}
