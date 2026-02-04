import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagBackendService } from '@fsms/backend/tag-backend-service';
import { CreateTagInputDto } from '../dto/create-tag-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TagCreatedEvent } from '../events/tag-created.event';
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
import { IQueryParam, QueryOperatorEnum, TagModel } from '@fsms/backend/db';
import { UpdateTagInputDto } from '../dto/update-tag-input.dto';
import { TagUpdatedEvent } from '../events/tag-updated.event';
import { DeleteTagInputDto } from '../dto/delete-tag-input.dto';
import { TagDeletedEvent } from '../events/tag-deleted.event';
import { validateUUID } from '@fsms/backend/util';

@Resolver()
export class TagResolver {
  constructor(
    private tagService: TagBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => TagModel)
  @UseGuards(InstitutionGuard)
  tags(
    @Args('query') query: IQueryParam,
    @CurrentInstitution() institutionId: string,
  ) {
    validateUUID(institutionId, 'institutionId');
    return this.tagService.findAll({
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

  @Query(() => TagModel)
  async tag(@Args('id') id: string) {
    validateUUID(id, 'id');
    return this.tagService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateTag)
  async createTag(@Body(new ValidationPipe()) params: CreateTagInputDto) {
    const tag = await this.tagService.create({
      ...params,
    });

    this.eventEmitter.emit('tag.created', new TagCreatedEvent(tag));

    return {
      message: 'Successfully created tag',
      data: tag,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateTag)
  async updateTag(@Body(new ValidationPipe()) params: UpdateTagInputDto) {
    validateUUID(params.id, 'id');
    const tag = await this.tagService.findById(params.id);
    if (tag) {
      await tag?.update(params.params);
      await tag?.save();

      this.eventEmitter.emit('tag.updated', new TagUpdatedEvent(tag));
      return {
        message: 'Successfully created tag',
        data: tag,
      };
    }
    throw new BadRequestException('No tag found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteTag)
  async deleteTag(@Body(new ValidationPipe()) { id }: DeleteTagInputDto) {
    validateUUID(id, 'id');
    const tag = (await this.tagService.findById(id)) as TagModel;

    await tag.destroy();
    this.eventEmitter.emit('tag.deleted', new TagDeletedEvent(tag));

    return {
      message: 'Successfully deleted tag',
      data: tag,
    };
  }
}
