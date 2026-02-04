import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InstitutionBackendService } from '@fsms/backend/institution-backend-service';
import { CreateInstitutionInputDto } from '../dto/create-institution-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InstitutionCreatedEvent } from '../events/institution-created.event';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { InstitutionModel, IQueryParam } from '@fsms/backend/db';
import { UpdateInstitutionInputDto } from '../dto/update-institution-input.dto';
import { InstitutionUpdatedEvent } from '../events/institution-updated.event';
import { DeleteInstitutionInputDto } from '../dto/delete-institution-input.dto';
import { InstitutionDeletedEvent } from '../events/institution-deleted.event';
import { validateUUID } from '@fsms/backend/util';

@Resolver(() => InstitutionModel)
export class InstitutionResolver {
  constructor(
    private institutionService: InstitutionBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => InstitutionModel)
  institutions(@Args('query') query: IQueryParam) {
    return this.institutionService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => InstitutionModel)
  async institution(@Args('id') id: string) {
    validateUUID(id, 'id');
    return this.institutionService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateInstitution)
  async createInstitution(
    @Body('params', new ValidationPipe()) params: CreateInstitutionInputDto,
  ) {
    const institution = await this.institutionService.create({
      ...params,
    });

    this.eventEmitter.emit(
      'institution.created',
      new InstitutionCreatedEvent(institution),
    );

    return {
      message: 'Successfully created institution',
      data: institution,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateInstitution)
  async updateInstitution(
    @Body(new ValidationPipe()) params: UpdateInstitutionInputDto,
  ) {
    validateUUID(params.id, 'id');
    const institution = await this.institutionService.findById(params.id);
    if (institution) {
      await institution?.update(params.params);
      await institution?.save();

      this.eventEmitter.emit(
        'institution.updated',
        new InstitutionUpdatedEvent(institution),
      );
      return {
        message: 'Successfully created institution',
        data: institution,
      };
    }
    throw new BadRequestException('No institution found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteInstitution)
  async deleteInstitution(
    @Body(new ValidationPipe()) { id }: DeleteInstitutionInputDto,
  ) {
    validateUUID(id, 'id');
    const institution = (await this.institutionService.findById(
      id,
    )) as InstitutionModel;

    await institution.destroy();
    this.eventEmitter.emit(
      'institution.deleted',
      new InstitutionDeletedEvent(institution),
    );

    return {
      message: 'Successfully deleted institution',
      data: institution,
    };
  }
}
