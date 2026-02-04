import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExamineeGroupBackendService } from '@fsms/backend/examinee-group-backend-service';
import { CreateExamineeGroupInputDto } from '../dto/create-examinee-group-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExamineeGroupCreatedEvent } from '../events/examinee-group-created.event';
import {
  CurrentInstitution,
  CurrentUser,
  InstitutionGuard,
  JwtAuthGuard,
} from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import {
  ExamineeGroupModel,
  ExamineeModel,
  IQueryParam,
  QueryOperatorEnum,
  UserModel,
} from '@fsms/backend/db';
import { UpdateExamineeGroupInputDto } from '../dto/update-examinee-group-input.dto';
import { ExamineeGroupUpdatedEvent } from '../events/examinee-group-updated.event';
import { DeleteExamineeGroupInputDto } from '../dto/delete-examinee-group-input.dto';
import { ExamineeGroupDeletedEvent } from '../events/examinee-group-deleted.event';

@Resolver(() => ExamineeGroupModel)
export class ExamineeGroupResolver {
  constructor(
    private examineeGroupService: ExamineeGroupBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => ExamineeGroupModel)
  @UseGuards(InstitutionGuard)
  examineeGroups(
    @Args('query') query: IQueryParam,
    @CurrentInstitution() institutionId: number,
  ) {
    return this.examineeGroupService.findAll({
      ...query,
      filters: [
        ...(query?.filters ?? []),
        {
          operator: QueryOperatorEnum.Equals,
          field: 'institutionId',
          value: `${institutionId}`,
          values: [],
        },
      ],
    });
  }

  @Query(() => ExamineeGroupModel)
  async examineeGroup(@Args('id') id: number) {
    return this.examineeGroupService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard, InstitutionGuard)
  @Permissions(PermissionsEnum.CreateExamineeGroup)
  async createExamineeGroup(
    @Body('params', new ValidationPipe()) params: CreateExamineeGroupInputDto,
    @CurrentInstitution() institutionId: number,
    @CurrentUser() user: UserModel,
  ) {
    const examineeGroup = await this.examineeGroupService.create({
      institutionId,
      createdById: user.id,
      ...params,
    });

    await this.examineeGroupService.saveExaminees(
      examineeGroup,
      user,
      params.examinees,
    );

    this.eventEmitter.emit(
      'examinee-group.created',
      new ExamineeGroupCreatedEvent(examineeGroup),
    );

    return {
      message: 'Successfully created examinee group',
      data: examineeGroup,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateExamineeGroup)
  async updateExamineeGroup(
    @Body(new ValidationPipe()) params: UpdateExamineeGroupInputDto,
  ) {
    const examineeGroup = await this.examineeGroupService.findById(params.id);
    if (examineeGroup) {
      await examineeGroup?.update(params.params);
      await examineeGroup?.save();

      this.eventEmitter.emit(
        'examineeGroup.updated',
        new ExamineeGroupUpdatedEvent(examineeGroup),
      );
      return {
        message: 'Successfully created examineeGroup',
        data: examineeGroup,
      };
    }
    throw new BadRequestException('No examinee group found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteExamineeGroup)
  async deleteExamineeGroup(
    @Body(new ValidationPipe()) { id }: DeleteExamineeGroupInputDto,
  ) {
    const examineeGroup = (await this.examineeGroupService.findById(
      id,
    )) as ExamineeGroupModel;

    await examineeGroup.destroy();
    this.eventEmitter.emit(
      'examinee-group.deleted',
      new ExamineeGroupDeletedEvent(examineeGroup),
    );

    return {
      message: 'Successfully deleted examinee group',
      data: examineeGroup,
    };
  }

  @ResolveField()
  async examinees(@Parent() examineeGroupModel: ExamineeGroupModel) {
    const examineeGroup = await this.examineeGroupService.findById(
      examineeGroupModel.id,
      {
        include: [ExamineeModel],
      },
    );
    return examineeGroup?.examinees ?? [];
  }
}
