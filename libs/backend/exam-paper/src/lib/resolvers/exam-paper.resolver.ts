import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExamPaperBackendService } from '@fsms/backend/exam-paper-backend-service';
import { CreateExamPaperInputDto } from '../dto/create-exam-paper-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExamPaperEvent } from '../events/exam-paper-created.event';
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
  ConfigModel,
  ExamineeGroupModel,
  ExamPaperModel,
  IQueryParam,
  TagModel,
  UserModel,
} from '@fsms/backend/db';
import { UpdateExamPaperInputDto } from '../dto/update-exam-paper-input.dto';
import { DeleteExamPaperInputDto } from '../dto/delete-exam-paper-input.dto';
import { ExamService } from '@fsms/backend/exam-service';
import { AssignExamineeGroupToExamPaperInputDto } from '../dto/assign-examinee-group-to-exam-paper-input.dto';
import { PublishExamPaperInputDto } from '../dto/publish-exam-paper-input.dto';
import { validateUUID } from '@fsms/backend/util';

@Resolver(() => ExamPaperModel)
export class ExamPaperResolver {
  constructor(
    private examPaperService: ExamPaperBackendService,
    private examService: ExamService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => ExamPaperModel)
  examPapers(@Args('query') query: IQueryParam) {
    return this.examPaperService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => ExamPaperModel)
  async examPaper(@Args('id') id: string) {
    validateUUID(id, 'id');
    return this.examPaperService.findById(id);
  }

  @ResolveField()
  async configs(@Parent() examPaperModel: ExamPaperModel) {
    validateUUID(examPaperModel.id, 'examPaperId');
    const examPaperConfigs = await this.examPaperService.findById(
      examPaperModel.id,
      {
        include: [
          {
            model: ConfigModel,
            through: {
              attributes: ['selected', 'value'],
            },
          },
        ],
      },
    );
    return (
      examPaperConfigs?.configs?.map(
        ({ dataValues: { ['config_exam_paper']: item, ...rest } }) => ({
          ...item.dataValues,
          ...rest,
        }),
      ) ?? []
    );
  }

  @ResolveField()
  async tags(@Parent() examPaperModel: ExamPaperModel) {
    validateUUID(examPaperModel.id, 'examPaperId');
    const examPaperTags = await this.examPaperService.findById(
      examPaperModel.id,
      {
        include: [TagModel],
      },
    );
    return examPaperTags?.tags ?? [];
  }

  @ResolveField()
  async examineeGroups(@Parent() examPaperModel: ExamPaperModel) {
    validateUUID(examPaperModel.id, 'examPaperId');
    const examPaperTags = await this.examPaperService.findById(
      examPaperModel.id,
      {
        include: [ExamineeGroupModel],
      },
    );
    return examPaperTags?.examineeGroups ?? [];
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard, InstitutionGuard)
  @Permissions(PermissionsEnum.CreateExamPaper)
  async createExamPaper(
    @Body('params', new ValidationPipe()) params: CreateExamPaperInputDto,
    @CurrentUser() user: UserModel,
    @CurrentInstitution() institutionId: string,
  ) {
    validateUUID(institutionId, 'institutionId');
    validateUUID(params.examId, 'examId');
    await this.examService.validateCreatedBy(params.examId, user.id);

    const {
      configs: inputConfigs,
      tags: inputTags,
      ...examPaperParams
    } = params;

    const examPaper = await this.examPaperService.create({
      institutionId,
      createdById: user.id,
      ...examPaperParams,
    });

    await this.examPaperService.setConfigs(
      examPaper,
      inputConfigs.map(({ id, selected, ...item }) => ({
        ...item,
        selected: selected as boolean,
        id: id as string,
      })),
    );
    await this.examPaperService.setTags(
      examPaper,
      inputTags.map((item) => ({ ...item, createdById: user.id })),
    );

    this.eventEmitter.emit('exam-paper.created', new ExamPaperEvent(examPaper));

    return {
      message: 'Successfully created exam paper',
      data: examPaper,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateExamPaper)
  async updateExamPaper(
    @Body(new ValidationPipe()) params: UpdateExamPaperInputDto,
  ) {
    validateUUID(params.id, 'id');
    const examPaper = await this.examPaperService.findById(params.id);
    if (examPaper) {
      await examPaper?.update(params.params);
      await examPaper?.save();

      this.eventEmitter.emit(
        'exam-paper.updated',
        new ExamPaperEvent(examPaper),
      );
      return {
        message: 'Successfully created examPaper',
        data: examPaper,
      };
    }
    throw new BadRequestException('No exam paper found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateExamPaper)
  async publishExamPaper(
    @Body(new ValidationPipe()) params: PublishExamPaperInputDto,
  ) {
    validateUUID(params.id, 'id');
    const examPaper = (await this.examPaperService.findById(
      params.id,
    )) as ExamPaperModel;
    examPaper.publishedAt = new Date();
    await examPaper.save();

    this.eventEmitter.emit(
      'exam-paper.published',
      new ExamPaperEvent(examPaper),
    );
    return {
      message: 'Successfully published the  exam paper',
      data: examPaper,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteExamPaper)
  async deleteExamPaper(
    @Body(new ValidationPipe()) { id }: DeleteExamPaperInputDto,
  ) {
    validateUUID(id, 'id');
    const examPaper = (await this.examPaperService.findById(
      id,
    )) as ExamPaperModel;

    await examPaper.destroy();
    this.eventEmitter.emit('exam-paper.deleted', new ExamPaperEvent(examPaper));

    return {
      message: 'Successfully deleted exam-paper',
      data: examPaper,
    };
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateExamPaper)
  async assignExamineeGroupToExamPaper(
    @Body('params', new ValidationPipe())
    { examPaperId, examineeGroups }: AssignExamineeGroupToExamPaperInputDto,
  ) {
    validateUUID(examPaperId, 'examPaperId');
    examineeGroups.forEach(({ id }) => validateUUID(id, 'examineeGroupId'));
    
    const examPaper = (await this.examPaperService.findById(
      examPaperId,
    )) as ExamPaperModel;

    const examineeGroupsIds = examineeGroups.map(({ id }) => id);
    await examPaper.$set('examineeGroups', examineeGroupsIds);

    this.eventEmitter.emit(
      'exam-paper.assigned',
      new ExamPaperEvent(examPaper),
    );

    return {
      message: 'Successfully assigned exam paper',
      data: examPaper,
    };
  }
}
