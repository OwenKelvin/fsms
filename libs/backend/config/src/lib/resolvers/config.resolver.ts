import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ConfigBackendService } from '@fsms/backend/config-backend-service';
import { CreateConfigInputDto } from '../dto/create-config-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigCreatedEvent } from '../events/config-created.event';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { ConfigModel, IQueryParam } from '@fsms/backend/db';
import { UpdateConfigInputDto } from '../dto/update-config-input.dto';
import { ConfigUpdatedEvent } from '../events/config-updated.event';
import { DeleteConfigInputDto } from '../dto/delete-config-input.dto';
import { ConfigDeletedEvent } from '../events/config-deleted.event';
import { validateUUID } from '@fsms/backend/util';

@Resolver()
export class ConfigResolver {
  constructor(
    private configService: ConfigBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => ConfigModel)
  configs(@Args('query') query: IQueryParam) {
    return this.configService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => ConfigModel)
  async config(@Args('id') id: string) {
    validateUUID(id, 'id');
    return this.configService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateConfig)
  async createConfig(@Body(new ValidationPipe()) params: CreateConfigInputDto) {
    const config = await this.configService.create({
      ...params,
    });

    this.eventEmitter.emit('config.created', new ConfigCreatedEvent(config));

    return {
      message: 'Successfully created config',
      data: config,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateConfig)
  async updateConfig(@Body(new ValidationPipe()) params: UpdateConfigInputDto) {
    validateUUID(params.id, 'id');
    const config = await this.configService.findById(params.id);
    if (config) {
      await config?.update(params.params);
      await config?.save();

      this.eventEmitter.emit('config.updated', new ConfigUpdatedEvent(config));
      return {
        message: 'Successfully created config',
        data: config,
      };
    }
    throw new BadRequestException('No config found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteConfig)
  async deleteConfig(@Body(new ValidationPipe()) { id }: DeleteConfigInputDto) {
    validateUUID(id, 'id');
    const config = (await this.configService.findById(id)) as ConfigModel;

    await config.destroy();
    this.eventEmitter.emit('config.deleted', new ConfigDeletedEvent(config));

    return {
      message: 'Successfully deleted config',
      data: config,
    };
  }
}
