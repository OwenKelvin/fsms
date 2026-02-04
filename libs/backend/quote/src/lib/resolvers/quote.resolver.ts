import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuoteBackendService } from '@fsms/backend/quote-backend-service';
import { CreateQuoteInputDto } from '../dto/create-quote-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QuoteCreatedEvent } from '../events/quote-created.event';
import {
  CurrentInstitution,
  InstitutionGuard,
  JwtAuthGuard,
} from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { IQueryParam, PlanModel, QuoteModel } from '@fsms/backend/db';
import { UpdateQuoteInputDto } from '../dto/update-quote-input.dto';
import { QuoteUpdatedEvent } from '../events/quote-updated.event';
import { DeleteQuoteInputDto } from '../dto/delete-quote-input.dto';
import { QuoteDeletedEvent } from '../events/quote-deleted.event';
import { PlanBackendService } from '@fsms/backend/plan-backend-service';

@Resolver(() => QuoteModel)
export class QuoteResolver {
  constructor(
    private quoteService: QuoteBackendService,
    private eventEmitter: EventEmitter2,
    private planService: PlanBackendService,
  ) {}

  @Query(() => QuoteModel)
  quotes(@Args('query') query: IQueryParam) {
    return this.quoteService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => QuoteModel)
  async quote(@Args('id') id: string) {
    return this.quoteService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard, InstitutionGuard)
  @Permissions(PermissionsEnum.CreateQuote)
  async createQuote(
    @Body('params', new ValidationPipe()) params: CreateQuoteInputDto,
    @CurrentInstitution() institutionId: string,
  ) {
    const taxRate = 0.16;
    const { planId, creditAmount } = params;
    const plan = (await this.planService.findById(planId)) as PlanModel;
    const costPerCreditInKES = plan.costPerCreditInKES ?? 0;
    const creditCost = Math.ceil(costPerCreditInKES * creditAmount);
    const taxCost = taxRate * creditCost;
    const feeCost = 0;
    const totalCost = taxCost + creditCost;

    const quote = await this.quoteService.create({
      planId,
      expireAt: new Date(new Date().getTime() + 3600000),
      totalCost,
      creditAmount,
      currency: 'KES',
      taxCost,
      creditCost,
      feeCost,
      institutionId,
    });

    this.eventEmitter.emit('quote.created', new QuoteCreatedEvent(quote));

    return {
      message: 'Successfully created quote',
      data: quote,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateQuote)
  async updateQuote(@Body(new ValidationPipe()) params: UpdateQuoteInputDto) {
    const quote = await this.quoteService.findById(params.id);
    if (quote) {
      await quote?.update(params.params);
      await quote?.save();

      this.eventEmitter.emit('quote.updated', new QuoteUpdatedEvent(quote));
      return {
        message: 'Successfully created quote',
        data: quote,
      };
    }
    throw new BadRequestException('No quote found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteQuote)
  async deleteQuote(@Body(new ValidationPipe()) { id }: DeleteQuoteInputDto) {
    const quote = (await this.quoteService.findById(id)) as QuoteModel;

    await quote.destroy();
    this.eventEmitter.emit('quote.deleted', new QuoteDeletedEvent(quote));

    return {
      message: 'Successfully deleted quote',
      data: quote,
    };
  }
}
