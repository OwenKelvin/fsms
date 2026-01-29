import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentBackendService } from '@fsms/backend/payment-backend-service';
import { CreatePaymentInputDto } from '../dto/create-payment-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentCreatedEvent } from '../events/payment-created.event';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { IQueryParam, PaymentModel } from '@fsms/backend/db';
import { UpdatePaymentInputDto } from '../dto/update-payment-input.dto';
import { PaymentUpdatedEvent } from '../events/payment-updated.event';
import { DeletePaymentInputDto } from '../dto/delete-payment-input.dto';
import { PaymentDeletedEvent } from '../events/payment-deleted.event';

@Resolver(() => PaymentModel)
export class PaymentResolver {
  constructor(
    private paymentService: PaymentBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => PaymentModel)
  payments(@Args('query') query: IQueryParam) {
    return this.paymentService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => PaymentModel)
  async payment(@Args('id') id: number) {
    return this.paymentService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreatePayment)
  async createPayment(
    @Body('params', new ValidationPipe()) params: CreatePaymentInputDto,
  ) {
    const payment = await this.paymentService.create({
      ...params,
    });

    this.eventEmitter.emit('payment.created', new PaymentCreatedEvent(payment));

    return {
      message: 'Successfully created payment',
      data: payment,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdatePayment)
  async updatePayment(
    @Body(new ValidationPipe()) params: UpdatePaymentInputDto,
  ) {
    const payment = await this.paymentService.findById(params.id);
    if (payment) {
      await payment?.update(params.params);
      await payment?.save();

      this.eventEmitter.emit(
        'payment.updated',
        new PaymentUpdatedEvent(payment),
      );
      return {
        message: 'Successfully created payment',
        data: payment,
      };
    }
    throw new BadRequestException('No payment found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeletePayment)
  async deletePayment(
    @Body(new ValidationPipe()) { id }: DeletePaymentInputDto,
  ) {
    const payment = (await this.paymentService.findById(id)) as PaymentModel;

    await payment.destroy();
    this.eventEmitter.emit('payment.deleted', new PaymentDeletedEvent(payment));

    return {
      message: 'Successfully deleted payment',
      data: payment,
    };
  }
}
