import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateExamInputDto } from '../dto/create-exam-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  CurrentInstitution,
  CurrentUser,
  JwtAuthGuard,
} from '@fsms/backend/auth';
import {
  PermissionGuard,
  Permissions,
  PermissionsEnum,
} from '@fsms/backend/permission-service';
import {
  ConfigModel,
  ExamModel,
  IQueryParam,
  QueryOperatorEnum,
  TagModel,
  UserModel,
} from '@fsms/backend/db';
import { ExamService } from '@fsms/backend/exam-service';
import { DeleteExamInputDto } from '../dto/delete-exam-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateExamInputDto } from '../dto/update-exam-input.dto';
import { ExamUpdateEvent } from '../events/exam-updated.event';
import { InstitutionGuard } from '@fsms/backend/auth';

@Resolver(() => ExamModel)
export class ExamResolver {
  constructor(
    private examService: ExamService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard, InstitutionGuard)
  @Permissions(PermissionsEnum.CreateExam)
  async createExam(
    @Body('params', new ValidationPipe()) params: CreateExamInputDto,
    @CurrentUser() user: UserModel,
    @CurrentInstitution() institutionId: number,
  ) {
    const {
      configs: inputConfigs,
      tags: inputTags,
      startDate: startDate,
      endDate: endDate,
      ...examParams
    } = params;

    if (startDate && endDate) {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start < now) {
        throw new BadRequestException('The start date must be in the future.');
      }

      if (end < now) {
        throw new BadRequestException('The end date must be in the future.');
      }
      if (start >= end) {
        throw new BadRequestException(
          'The start date must be before the end date.',
        );
      }
    }

    const exam = await this.examService.create({
      createdById: user.id,
      startDate,
      endDate,
      institutionId,
      ...examParams,
    });

    await this.examService.setConfigs(
      exam,
      inputConfigs.map(({ id, selected, ...item }) => ({
        ...item,
        selected: selected as boolean,
        configId: id as number,
      })),
    );
    await this.examService.setTags(
      exam,
      inputTags.map((item) => ({
        ...item,
        createdById: user.id,
        institutionId,
      })),
    );

    return {
      message: 'Successfully created exam',
      data: exam,
    };
  }

  @Query(() => ExamModel)
  @UseGuards(JwtAuthGuard, InstitutionGuard)
  exams(
    @Args('query') query: IQueryParam,
    @CurrentUser() user: UserModel,
    @CurrentInstitution() institutionId: number,
  ) {
    return this.examService.findAll({
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

  @Query(() => ExamModel)
  async exam(@Args('id') id: number) {
    return this.examService.findById(id);
  }

  @ResolveField()
  async configs(@Parent() examModel: ExamModel) {
    const examConfigs = await this.examService.findById(examModel.id, {
      include: [
        {
          model: ConfigModel,
          through: {
            attributes: ['selected', 'value'],
          },
        },
      ],
    });
    return (
      examConfigs?.configs?.map(
        ({ dataValues: { ['config_exam']: item, ...rest } }) => ({
          ...item.dataValues,
          ...rest,
        }),
      ) ?? []
    );
  }

  @ResolveField()
  async tags(@Parent() examModel: ExamModel) {
    const examTags = await this.examService.findById(examModel.id, {
      include: [TagModel],
    });
    return examTags?.tags ?? [];
  }

  @ResolveField()
  async examPapers(
    @Parent() examModel: ExamModel,
    @Args() { limit = 5, skip = 0 },
  ) {
    const rows = await this.examService.findExamPapers(
      examModel.id,
      limit,
      skip,
    );

    return rows;
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteExam)
  async deleteExam(@Body(new ValidationPipe()) { id }: DeleteExamInputDto) {
    const exam = (await this.examService.findById(id)) as ExamModel;

    await exam.destroy();
    // this.eventEmitter.emit('tag.deleted', new TagDeletedEvent(tag));

    return {
      message: 'Successfully deleted tag',
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard, InstitutionGuard)
  @Permissions(PermissionsEnum.UpdateExam)
  async updateExam(
    @Body(new ValidationPipe()) input: UpdateExamInputDto,
    @CurrentUser() user: UserModel,
    @CurrentInstitution() institutionId: number,
  ) {
    const { id, params } = input;

    if (params.startDate && params.endDate) {
      const now = new Date();
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);

      if (start < now) {
        throw new BadRequestException('The start date must be in the future.');
      }

      if (end < now) {
        throw new BadRequestException('The end date must be in the future.');
      }
      if (start >= end) {
        throw new BadRequestException(
          'The start date must be before the end date.',
        );
      }
    }

    const exam = await this.examService.findById(id);

    if (exam) {
      await this.examService.setConfigs(
        exam,
        params.configs.map(({ id, selected, ...item }) => ({
          ...item,
          selected: selected as boolean,
          configId: id as number,
        })),
      );
      await this.examService.setTags(
        exam,
        params.tags.map((item) => ({
          ...item,
          createdById: user.id,
          institutionId,
        })),
      );
      await exam?.update(params);
      await exam?.save();

      this.eventEmitter.emit('exam.updated', new ExamUpdateEvent(exam));
      return {
        message: 'Successfully updated exam',
        data: exam,
      };
    }
    throw new BadRequestException('No exam-paper found');
  }
}
