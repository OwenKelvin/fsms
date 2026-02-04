import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreditBackendService } from '@fsms/backend/credit-backend-service';
import { CreateCreditInputDto } from '../dto/create-credit-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreditCreatedEvent } from '../events/credit-created.event';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { CreditModel, IQueryParam } from '@fsms/backend/db';
import { UpdateCreditInputDto } from '../dto/update-credit-input.dto';
import { CreditUpdatedEvent } from '../events/credit-updated.event';
import { DeleteCreditInputDto } from '../dto/delete-credit-input.dto';
import { CreditDeletedEvent } from '../events/credit-deleted.event';

@Resolver(() => CreditModel)
export class CreditResolver {
  constructor(
    private creditService: CreditBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => CreditModel)
  credits(@Args('query') query: IQueryParam) {
    return this.creditService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => CreditModel)
  async credit(@Args('id') id: number) {
    return this.creditService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateCredit)
  async createCredit(
    @Body('params', new ValidationPipe()) params: CreateCreditInputDto,
  ) {
    const credit = await this.creditService.create({
      ...params,
    });

    this.eventEmitter.emit('credit.created', new CreditCreatedEvent(credit));

    return {
      message: 'Successfully created credit',
      data: credit,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateCredit)
  async updateCredit(@Body(new ValidationPipe()) params: UpdateCreditInputDto) {
    const credit = await this.creditService.findById(params.id);
    if (credit) {
      await credit?.update(params.params);
      await credit?.save();

      this.eventEmitter.emit('credit.updated', new CreditUpdatedEvent(credit));
      return {
        message: 'Successfully created credit',
        data: credit,
      };
    }
    throw new BadRequestException('No credit found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteCredit)
  async deleteCredit(@Body(new ValidationPipe()) { id }: DeleteCreditInputDto) {
    const credit = (await this.creditService.findById(id)) as CreditModel;

    await credit.destroy();
    this.eventEmitter.emit('credit.deleted', new CreditDeletedEvent(credit));

    return {
      message: 'Successfully deleted credit',
      data: credit,
    };
  }
}
