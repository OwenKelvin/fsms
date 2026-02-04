import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PlanBackendService } from '@fsms/backend/plan-backend-service';
import { CreatePlanInputDto } from '../dto/create-plan-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlanCreatedEvent } from '../events/plan-created.event';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { IQueryParam, PlanInfoModel, PlanModel } from '@fsms/backend/db';
import { UpdatePlanInputDto } from '../dto/update-plan-input.dto';
import { PlanUpdatedEvent } from '../events/plan-updated.event';
import { DeletePlanInputDto } from '../dto/delete-plan-input.dto';
import { PlanDeletedEvent } from '../events/plan-deleted.event';
import { validateUUID } from '@fsms/backend/util';

@Resolver(() => PlanModel)
export class PlanResolver {
  constructor(
    private planService: PlanBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => PlanModel)
  plans(@Args('query') query: IQueryParam) {
    return this.planService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @ResolveField(() => [PlanInfoModel])
  async planInfos(@Parent() plan: PlanModel) {
    validateUUID(plan.id, 'planId');
    // Fetch the associated plan infos for the given plan
    return await PlanInfoModel.findAll({
      where: { planId: plan.id },
    });
  }

  @Query(() => PlanModel)
  async plan(@Args('id') id: string) {
    validateUUID(id, 'id');
    return this.planService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreatePlan)
  async createPlan(
    @Body('params', new ValidationPipe()) params: CreatePlanInputDto,
  ) {
    const plan = await this.planService.create({
      ...params,
    });

    this.eventEmitter.emit('plan.created', new PlanCreatedEvent(plan));

    return {
      message: 'Successfully created plan',
      data: plan,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdatePlan)
  async updatePlan(@Body(new ValidationPipe()) params: UpdatePlanInputDto) {
    validateUUID(params.id, 'id');
    const plan = await this.planService.findById(params.id);
    if (plan) {
      await plan?.update(params.params);
      await plan?.save();

      this.eventEmitter.emit('plan.updated', new PlanUpdatedEvent(plan));
      return {
        message: 'Successfully created plan',
        data: plan,
      };
    }
    throw new BadRequestException('No plan found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeletePlan)
  async deletePlan(@Body(new ValidationPipe()) { id }: DeletePlanInputDto) {
    validateUUID(id, 'id');
    const plan = (await this.planService.findById(id)) as PlanModel;

    await plan.destroy();
    this.eventEmitter.emit('plan.deleted', new PlanDeletedEvent(plan));

    return {
      message: 'Successfully deleted plan',
      data: plan,
    };
  }
}
