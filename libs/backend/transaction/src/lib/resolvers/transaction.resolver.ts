import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionBackendService } from '@fsms/backend/transaction-backend-service';
import { CreateTransactionInputDto } from '../dto/create-transaction-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransactionCreatedEvent } from '../events/transaction-created.event';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { IQueryParam, TransactionModel } from '@fsms/backend/db';
import { UpdateTransactionInputDto } from '../dto/update-transaction-input.dto';
import { TransactionUpdatedEvent } from '../events/transaction-updated.event';
import { DeleteTransactionInputDto } from '../dto/delete-transaction-input.dto';
import { TransactionDeletedEvent } from '../events/transaction-deleted.event';

@Resolver(() => TransactionModel)
export class TransactionResolver {
  constructor(
    private transactionService: TransactionBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => TransactionModel)
  transactions(@Args('query') query: IQueryParam) {
    return this.transactionService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => TransactionModel)
  async transaction(@Args('id') id: number) {
    return this.transactionService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateTransaction)
  async createTransaction(
    @Body('params', new ValidationPipe()) params: CreateTransactionInputDto,
  ) {
    const transaction = await this.transactionService.create({
      ...params,
    });

    this.eventEmitter.emit(
      'transaction.created',
      new TransactionCreatedEvent(transaction),
    );

    return {
      message: 'Successfully created transaction',
      data: transaction,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateTransaction)
  async updateTransaction(
    @Body(new ValidationPipe()) params: UpdateTransactionInputDto,
  ) {
    const transaction = await this.transactionService.findById(params.id);
    if (transaction) {
      await transaction?.update(params.params);
      await transaction?.save();

      this.eventEmitter.emit(
        'transaction.updated',
        new TransactionUpdatedEvent(transaction),
      );
      return {
        message: 'Successfully created transaction',
        data: transaction,
      };
    }
    throw new BadRequestException('No transaction found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteTransaction)
  async deleteTransaction(
    @Body(new ValidationPipe()) { id }: DeleteTransactionInputDto,
  ) {
    const transaction = (await this.transactionService.findById(
      id,
    )) as TransactionModel;

    await transaction.destroy();
    this.eventEmitter.emit(
      'transaction.deleted',
      new TransactionDeletedEvent(transaction),
    );

    return {
      message: 'Successfully deleted transaction',
      data: transaction,
    };
  }
}
