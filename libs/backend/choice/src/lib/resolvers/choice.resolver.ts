import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChoiceBackendService } from '@fsms/backend/choice-backend-service';
import { CreateChoiceInputDto } from '../dto/create-choice-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChoiceCreatedEvent } from '../events/choice-created.event';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { ChoiceModel, IQueryParam } from '@fsms/backend/db';
import { UpdateChoiceInputDto } from '../dto/update-choice-input.dto';
import { ChoiceUpdatedEvent } from '../events/choice-updated.event';
import { DeleteChoiceInputDto } from '../dto/delete-choice-input.dto';
import { ChoiceDeletedEvent } from '../events/choice-deleted.event';

@Resolver(() => ChoiceModel)
export class ChoiceResolver {
  constructor(
    private choiceService: ChoiceBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => ChoiceModel)
  choices(@Args('query') query: IQueryParam) {
    return this.choiceService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => ChoiceModel)
  async choice(@Args('id') id: number) {
    return this.choiceService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateChoice)
  async createChoice(
    @Body('params', new ValidationPipe()) params: CreateChoiceInputDto,
  ) {
    const choice = await this.choiceService.create({
      ...params,
    });

    this.eventEmitter.emit('choice.created', new ChoiceCreatedEvent(choice));

    return {
      message: 'Successfully created choice',
      data: choice,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateChoice)
  async updateChoice(@Body(new ValidationPipe()) params: UpdateChoiceInputDto) {
    const choice = await this.choiceService.findById(params.id);
    if (choice) {
      await choice?.update(params.params);
      await choice?.save();

      this.eventEmitter.emit('choice.updated', new ChoiceUpdatedEvent(choice));
      return {
        message: 'Successfully created choice',
        data: choice,
      };
    }
    throw new BadRequestException('No choice found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteChoice)
  async deleteChoice(@Body(new ValidationPipe()) { id }: DeleteChoiceInputDto) {
    const choice = (await this.choiceService.findById(id)) as ChoiceModel;

    await choice.destroy();
    this.eventEmitter.emit('choice.deleted', new ChoiceDeletedEvent(choice));

    return {
      message: 'Successfully deleted choice',
      data: choice,
    };
  }
}
