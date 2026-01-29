import { Body, Controller, Inject, Post } from '@nestjs/common';
import { MpesaStkRequestModel, QuoteModel } from '@fsms/backend/db';
import { MpesaStkRequestService } from '@fsms/backend/mpesa-service';
import { QuoteBackendService } from '@fsms/backend/quote-backend-service';
import { TransactionBackendService } from '@fsms/backend/transaction-backend-service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreditBackendService } from '@fsms/backend/credit-backend-service';
import { Sequelize } from 'sequelize-typescript';
import { PUB_SUB } from '@fsms/backend/util';
import { RedisPubSub } from 'graphql-redis-subscriptions';

interface MpesaCallbackBody {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata: {
        Item: [
          {
            Name: 'Amount';
            Value: number;
          },
          {
            Name: 'MpesaReceiptNumber';
            Value: string;
          },
          {
            Name: 'TransactionDate';
            Value: number;
          },
          {
            Name: 'PhoneNumber';
            Value: number;
          },
        ];
      };
    };
  };
}

@Controller('api/payment-callback')
export class MpesaController {
  stkRequest: MpesaStkRequestModel | null = null;

  constructor(
    @Inject(Sequelize)
    private readonly sequelize: Sequelize,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private quoteService: QuoteBackendService,
    private mpesaStkRequestService: MpesaStkRequestService,
    private transactionService: TransactionBackendService,
    private eventEmitter: EventEmitter2,
    private creditService: CreditBackendService,
  ) {}

  @Post('transaction-status/result')
  async transactionStatusResult(@Body() requestBody2: Record<string, string>) {
    console.log({ requestBody2 });
  }

  @Post('transaction-status/timeout')
  async transactionStatusTimeout(@Body() requestBody: Record<string, string>) {
    console.log({ requestBody });
  }

  @Post('stk-push-request')
  async handleCallback(@Body() requestBody: MpesaCallbackBody) {
    if (await this.isValidCallback(requestBody)) {
      const transaction = await this.createQuoteTransaction();

      await this.pubSub.publish('mpesaPaymentReceived', {
        transaction: transaction?.dataValues,
      });

      return {
        ResultCode: 0,
        ResultDesc: 'Success',
      };
    } else {
      // Respond with error
      return {
        ResultCode: 1,
        ResultDesc: 'Invalid request',
      };
    }
  }

  private async isValidCallback(body: MpesaCallbackBody) {
    const checkoutRequestID = body.Body.stkCallback.CheckoutRequestID;
    const merchantRequestID = body.Body.stkCallback.MerchantRequestID;
    this.stkRequest = await this.mpesaStkRequestService.findByMerchantRequestId(
      merchantRequestID,
      checkoutRequestID,
    );
    return !!this.stkRequest;
  }

  private async createQuoteTransaction() {
    const transaction = await this.sequelize.transaction();

    try {
      const quote = (await this.quoteService.findById(
        this.stkRequest?.quoteId as number,
      )) as QuoteModel;
      quote.set({ purchaseAt: new Date() });
      await quote.save();

      const [credit] = await this.creditService.model.findOrCreate({
        where: { institutionId: quote.institutionId },
        defaults: { balance: 0 },
        transaction,
      });

      credit.balance = (credit.balance ?? 0) + quote.creditAmount;
      await credit.save({ transaction });

      const quoteTransaction = await this.transactionService.create({
        institutionId: quote.institutionId,
        type: 'purchase',
        amount: quote.creditAmount,
        balanceAfterTransaction: credit.balance,
        description: 'Mpesa Payment',
        quoteId: quote.id,
      });

      // TODO update payment table

      this.eventEmitter.emit('transaction.created', {
        transaction: quoteTransaction,
      });

      await transaction.commit();

      return quoteTransaction;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
