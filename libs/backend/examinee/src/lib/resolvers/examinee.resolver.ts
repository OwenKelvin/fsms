import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ExamineeBackendService } from '@fsms/backend/examinee-backend-service';
import { CreateExamineeInputDto } from '../dto/create-examinee-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExamineeCreatedEvent } from '../events/examinee-created.event';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { ExamineeModel, IQueryParam } from '@fsms/backend/db';
import { UpdateExamineeInputDto } from '../dto/update-examinee-input.dto';
import { ExamineeUpdatedEvent } from '../events/examinee-updated.event';
import { DeleteExamineeInputDto } from '../dto/delete-examinee-input.dto';
import { ExamineeDeletedEvent } from '../events/examinee-deleted.event';

@Resolver(() => ExamineeModel)
export class ExamineeResolver {
  constructor(
    private examineeService: ExamineeBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => ExamineeModel)
  examinees(@Args('query') query: IQueryParam) {
    return this.examineeService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => ExamineeModel)
  async examinee(@Args('id') id: number) {
    return this.examineeService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateExaminee)
  async createExaminee(
    @Body('params', new ValidationPipe()) params: CreateExamineeInputDto,
  ) {
    const examinee = await this.examineeService.create({
      ...params,
    });

    this.eventEmitter.emit(
      'examinee.created',
      new ExamineeCreatedEvent(examinee),
    );

    return {
      message: 'Successfully created examinee',
      data: examinee,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateExaminee)
  async updateExaminee(
    @Body(new ValidationPipe()) params: UpdateExamineeInputDto,
  ) {
    const examinee = await this.examineeService.findById(params.id);
    if (examinee) {
      await examinee?.update(params.params);
      await examinee?.save();

      this.eventEmitter.emit(
        'examinee.updated',
        new ExamineeUpdatedEvent(examinee),
      );
      return {
        message: 'Successfully created examinee',
        data: examinee,
      };
    }
    throw new BadRequestException('No examinee found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteExaminee)
  async deleteExaminee(
    @Body(new ValidationPipe()) { id }: DeleteExamineeInputDto,
  ) {
    const examinee = (await this.examineeService.findById(id)) as ExamineeModel;

    await examinee.destroy();
    this.eventEmitter.emit(
      'examinee.deleted',
      new ExamineeDeletedEvent(examinee),
    );

    return {
      message: 'Successfully deleted examinee',
      data: examinee,
    };
  }
}
