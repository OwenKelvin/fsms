import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InstructionBackendService } from '@fsms/backend/instruction-backend-service';
import { CreateInstructionInputDto } from '../dto/create-instruction-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InstructionCreatedEvent } from '../events/instruction-created.event';
import { CurrentUser, JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { InstructionModel, IQueryParam, UserModel } from '@fsms/backend/db';
import { UpdateInstructionInputDto } from '../dto/update-instruction-input.dto';
import { InstructionUpdatedEvent } from '../events/instruction-updated.event';
import { DeleteInstructionInputDto } from '../dto/delete-instruction-input.dto';
import { InstructionDeletedEvent } from '../events/instruction-deleted.event';

@Resolver(() => InstructionModel)
export class InstructionResolver {
  constructor(
    private instructionService: InstructionBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => InstructionModel)
  instructions(@Args('query') query: IQueryParam) {
    return this.instructionService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => InstructionModel)
  async instruction(@Args('id') id: string) {
    return this.instructionService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateExamInstruction)
  async createInstruction(
    @Body('params', new ValidationPipe()) params: CreateInstructionInputDto,
    @CurrentUser() user: UserModel,
  ) {
    const instruction = await this.instructionService.create({
      ...params,
      createdById: user.id,
    });

    this.eventEmitter.emit(
      'instruction.created',
      new InstructionCreatedEvent(instruction),
    );

    return {
      message: 'Successfully created instruction',
      data: instruction,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateExamInstruction)
  async updateInstruction(
    @Body(new ValidationPipe()) params: UpdateInstructionInputDto,
  ) {
    const instruction = await this.instructionService.findById(params.id);
    if (instruction) {
      await instruction?.update(params.params);
      await instruction?.save();

      this.eventEmitter.emit(
        'instruction.updated',
        new InstructionUpdatedEvent(instruction),
      );
      return {
        message: 'Successfully created instruction',
        data: instruction,
      };
    }
    throw new BadRequestException('No instruction found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteExamInstruction)
  async deleteInstruction(
    @Body(new ValidationPipe()) { id }: DeleteInstructionInputDto,
  ) {
    const instruction = (await this.instructionService.findById(
      id,
    )) as InstructionModel;

    await instruction.destroy();
    this.eventEmitter.emit(
      'instruction.deleted',
      new InstructionDeletedEvent(instruction),
    );

    return {
      message: 'Successfully deleted instruction',
      data: instruction,
    };
  }
}
