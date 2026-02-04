import { Test, TestingModule } from '@nestjs/testing';
import { QuestionBackendService } from '@fsms/backend/question-backend-service';
import { CreateQuestionInputDto } from '../dto/create-question-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QuestionCreatedEvent } from '../events/question-created.event';
import { I18nService } from 'nestjs-i18n';
import { QuestionResolver } from './question.resolver';
import { ChoiceBackendService } from '@fsms/backend/choice-backend-service';
import { UserModel } from '@fsms/backend/db';
import { InstitutionBackendService } from '@fsms/backend/institution-backend-service';
import { AuthServiceBackend } from '@fsms/backend/auth-service';
import { PUB_SUB } from '@fsms/backend/util';

const QuestionBackendServiceMock = {
  create: jest.fn(),
  saveChoices: jest.fn(),
  setTags: jest.fn(),
};

const ChoiceBackendServiceMock = {
  create: jest.fn(),
};
const InstitutionBackendServiceMock = {
  create: jest.fn(),
};
const AuthServiceBackendMock = {};
const pubSubMock = {};

describe('QuestionResolver', () => {
  let resolver: QuestionResolver;
  let questionService: QuestionBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: ChoiceBackendService,
          useValue: ChoiceBackendServiceMock,
        },
        {
          provide: QuestionBackendService,
          useValue: QuestionBackendServiceMock,
        },
        {
          provide: InstitutionBackendService,
          useValue: InstitutionBackendServiceMock,
        },
        {
          provide: AuthServiceBackend,
          useValue: AuthServiceBackendMock,
        },
        {
          provide: PUB_SUB,
          useValue: pubSubMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<QuestionResolver>(QuestionResolver);
    questionService = module.get<QuestionBackendService>(
      QuestionBackendService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createQuestion', () => {
    it('should create a question and emit event', async () => {
      const createQuestionInput: CreateQuestionInputDto = {
        description: 'new question',
        tags: [] as { id: string }[],
      } as CreateQuestionInputDto;
      const createdQuestion = {
        id: 1,
        description: 'new question',
        createdById: 1,
      };
      const institutionId = 1;
      QuestionBackendServiceMock.create.mockResolvedValueOnce(createdQuestion);

      const result = await resolver.createQuestion(
        createQuestionInput,
        {
          id: 1,
        } as UserModel,
        institutionId,
      );

      expect(result).toEqual({
        message: 'Successfully created question',
        data: createdQuestion,
      });
      expect(questionService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'new question',
          createdById: 1,
        }),
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'question.created',
        expect.any(QuestionCreatedEvent),
      );
    });
  });
});
