import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Body, Inject, UseGuards } from '@nestjs/common';
import { CurrentInstitution, InstitutionGuard } from '@fsms/backend/auth';
import { MpesaService } from '@fsms/backend/mpesa-service';
import { RequestMpesaStkInputDto } from './dto/request-mpesa-stk-input.dto';
import { TransactionModel } from '@fsms/backend/db';
import { PUB_SUB } from '@fsms/backend/util';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
export class MpesaResolver {
  constructor(
    private mpesaService: MpesaService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  @Query()
  async mpesaTransactionStatus(
    @Body() { transactionRef }: { transactionRef: string },
  ) {
    return await this.mpesaService.requestTransactionStatus(transactionRef);
  }

  @Mutation()
  @UseGuards(InstitutionGuard)
  async requestMpesaStk(
    @Body() { phoneNumber, quoteId }: RequestMpesaStkInputDto,
    @CurrentInstitution() institutionId: string,
  ) {
    await this.mpesaService.requestStkPush(phoneNumber, quoteId, {
      institutionId: String(institutionId),
    });

    return {
      message:
        'Request for stk push sent successfully, please check your phone for a payment prompt',
    };
  }

  @Subscription(() => TransactionModel, {
    filter(this: MpesaResolver, payload, variables) {
      return payload?.transaction?.quoteId === variables?.quoteId;
    },
    resolve: (value) => value,
  })
  mpesaPaymentReceived() {
    return this.pubSub.asyncIterator('mpesaPaymentReceived');
  }
}
