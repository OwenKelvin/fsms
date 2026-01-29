import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OtpBackendService } from '@fsms/backend/otp-backend-service';
import { CreateOtpInputDto } from '../dto/create-otp-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OtpCreatedEvent } from '../events/otp-created.event';
import { JwtAuthGuard } from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import { IQueryParam, OtpModel } from '@fsms/backend/db';
import { UpdateOtpInputDto } from '../dto/update-otp-input.dto';
import { OtpUpdatedEvent } from '../events/otp-updated.event';
import { DeleteOtpInputDto } from '../dto/delete-otp-input.dto';
import { OtpDeletedEvent } from '../events/otp-deleted.event';

@Resolver()
export class OtpResolver {
  constructor(
    private otpService: OtpBackendService,
    private eventEmitter: EventEmitter2
  ) {}

  @Query(() => OtpModel)
  otps(@Args('query') query: IQueryParam) {
    return this.otpService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => OtpModel)
  async otp(@Args('id') id: number) {
    return this.otpService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.CreateOtp)
  async createOtp(@Body(new ValidationPipe()) params: CreateOtpInputDto) {
    const otp = await this.otpService.create({
      ...params,
    });

    this.eventEmitter.emit('otp.created', new OtpCreatedEvent(otp));

    return {
      message: 'Successfully created otp',
      data: otp,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateOtp)
  async updateOtp(@Body(new ValidationPipe()) params: UpdateOtpInputDto) {
    const otp = await this.otpService.findById(params.id);
    if (otp) {
      await otp?.update(params.params);
      await otp?.save();

      this.eventEmitter.emit('otp.updated', new OtpUpdatedEvent(otp));
      return {
        message: 'Successfully created otp',
        data: otp,
      };
    }
    throw new BadRequestException('No otp found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteOtp)
  async deleteOtp(@Body(new ValidationPipe()) { id }: DeleteOtpInputDto) {
    const otp = (await this.otpService.findById(id)) as OtpModel;

    await otp.destroy();
    this.eventEmitter.emit('otp.deleted', new OtpDeletedEvent(otp));

    return {
      message: 'Successfully deleted otp',
      data: otp,
    };
  }
}
