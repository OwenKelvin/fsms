import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { QuestionBackendService } from '@fsms/backend/question-backend-service';
import { CreateQuestionInputDto } from '../dto/create-question-input.dto';
import {
  BadRequestException,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QuestionCreatedEvent } from '../events/question-created.event';
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
  IQueryParam,
  QuestionModel,
  TagModel,
  UserModel,
} from '@fsms/backend/db';
import { UpdateQuestionInputDto } from '../dto/update-question-input.dto';
import { QuestionUpdatedEvent } from '../events/question-updated.event';
import { DeleteQuestionInputDto } from '../dto/delete-question-input.dto';
import { QuestionDeletedEvent } from '../events/question-deleted.event';
import { ChoiceBackendService } from '@fsms/backend/choice-backend-service';
import { validateUUID } from '@fsms/backend/util';

@Resolver(() => QuestionModel)
export class QuestionResolver {
  constructor(
    private questionService: QuestionBackendService,
    private choiceService: ChoiceBackendService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Query(() => QuestionModel)
  questions(@Args('query') query: IQueryParam) {
    return this.questionService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @Query(() => QuestionModel)
  async question(@Args('id') id: string) {
    validateUUID(id, 'id');
    return this.questionService.findById(id);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard, InstitutionGuard)
  @Permissions(PermissionsEnum.CreateQuestion)
  async createQuestion(
    @Body('params', new ValidationPipe()) params: CreateQuestionInputDto,
    @CurrentUser() user: UserModel,
    @CurrentInstitution() institutionId: string,
  ) {
    validateUUID(institutionId, 'institutionId');
    const { choices, tags: inputTags, ...questionParams } = params;

    const question = await this.questionService.create({
      ...questionParams,
      createdById: user.id,
    });

    await this.questionService.saveChoices({
      questionId: question.id,
      choices,
      createdById: user.id,
    });

    await this.questionService.setTags(
      question,
      inputTags.map((item) => ({
        ...item,
        createdById: user.id,
        institutionId,
      })),
    );

    this.eventEmitter.emit(
      'question.created',
      new QuestionCreatedEvent(question),
    );

    return {
      message: 'Successfully created question',
      data: question,
    };
  }

  @ResolveField()
  async choices(@Parent() questionModel: QuestionModel) {
    validateUUID(questionModel.id, 'questionId');
    return await this.choiceService.findChoicesByQuestionId(questionModel.id);
  }

  @ResolveField()
  async tags(@Parent() questionModel: QuestionModel) {
    validateUUID(questionModel.id, 'questionId');
    const questionTags = await this.questionService.findById(questionModel.id, {
      include: [TagModel],
    });
    return questionTags?.tags ?? [];
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.UpdateQuestion)
  async updateQuestion(
    @Body(new ValidationPipe()) params: UpdateQuestionInputDto,
  ) {
    validateUUID(params.id, 'id');
    const question = await this.questionService.findById(params.id);
    if (question) {
      await question?.update(params.params);
      await question?.save();

      this.eventEmitter.emit(
        'question.updated',
        new QuestionUpdatedEvent(question),
      );
      return {
        message: 'Successfully updated question',
        data: question,
      };
    }
    throw new BadRequestException('No question found');
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(PermissionsEnum.DeleteQuestion)
  async deleteQuestion(
    @Body(new ValidationPipe()) { id }: DeleteQuestionInputDto,
  ) {
    validateUUID(id, 'id');
    const question = (await this.questionService.findById(id)) as QuestionModel;

    await question.destroy();
    this.eventEmitter.emit(
      'question.deleted',
      new QuestionDeletedEvent(question),
    );

    return {
      message: 'Successfully deleted question',
      data: question,
    };
  }
}
