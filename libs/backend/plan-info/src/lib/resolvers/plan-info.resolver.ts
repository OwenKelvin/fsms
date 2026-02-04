import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlanInfoBackendService } from '@fsms/backend/plan-info-backend-service';
import { CreatePlanInfoInputDto } from '../dto/create-plan-info-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlanInfoCreatedEvent } from '../events/plan-info-created.event';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { IQueryParam, PlanInfoModel } from '@fsms/backend/db';
import { UpdatePlanInfoInputDto } from '../dto/update-plan-info-input.dto';
import { PlanInfoUpdatedEvent } from '../events/plan-info-updated.event';
import { DeletePlanInfoInputDto } from '../dto/delete-plan-info-input.dto';
import { PlanInfoDeletedEvent } from '../events/plan-info-deleted.event';

@Resolver(() => PlanInfoModel)
export class PlanInfoResolver {
  constructor(
    private planInfoService: PlanInfoBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => PlanInfoModel)
  planInfos(@Args('query') query: IQueryParam) {
    return this.planInfoService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => PlanInfoModel)
  async planInfo(@Args('id') id: string) {
    return this.planInfoService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreatePlanInfo)
  async createPlanInfo(
    @Body('params', new ValidationPipe()) params: CreatePlanInfoInputDto,
  ) {
    const planInfo = await this.planInfoService.create({
      ...params,
    });

    this.eventEmitter.emit(
      'plan-info.created',
      new PlanInfoCreatedEvent(planInfo),
    );

    return {
      message: 'Successfully created plan-info',
      data: planInfo,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdatePlanInfo)
  async updatePlanInfo(
    @Body(new ValidationPipe()) params: UpdatePlanInfoInputDto,
  ) {
    const planInfo = await this.planInfoService.findById(params.id);
    if (planInfo) {
      await planInfo?.update(params.params);
      await planInfo?.save();

      this.eventEmitter.emit(
        'planInfo.updated',
        new PlanInfoUpdatedEvent(planInfo),
      );
      return {
        message: 'Successfully created planInfo',
        data: planInfo,
      };
    }
    throw new BadRequestException('No plan-info found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeletePlanInfo)
  async deletePlanInfo(
    @Body(new ValidationPipe()) { id }: DeletePlanInfoInputDto,
  ) {
    const planInfo = (await this.planInfoService.findById(id)) as PlanInfoModel;

    await planInfo.destroy();
    this.eventEmitter.emit(
      'plan-info.deleted',
      new PlanInfoDeletedEvent(planInfo),
    );

    return {
      message: 'Successfully deleted plan-info',
      data: planInfo,
    };
  }
}
