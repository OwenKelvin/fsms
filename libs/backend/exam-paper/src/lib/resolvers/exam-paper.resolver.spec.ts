import { Test, TestingModule } from '@nestjs/testing';
import { ExamPaperBackendService } from '@fsms/backend/exam-paper-backend-service';
import { CreateExamPaperInputDto } from '../dto/create-exam-paper-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExamPaperCreatedEvent } from '../events/exam-paper-created.event';
import { I18nService } from 'nestjs-i18n';
import { ExamPaperResolver } from './exam-paper.resolver';
import { UserModel } from '@fsms/backend/db';
import { ExamService } from '@fsms/backend/exam-service';
import { InstitutionBackendService } from '@fsms/backend/institution-backend-service';
import { AuthServiceBackend } from '@fsms/backend/auth-service';

const ExamPaperBackendServiceMock = {
  create: jest.fn(),
  setConfigs: jest.fn(),
  setTags: jest.fn(),
};

const ExamServiceMock = {
  create: jest.fn(),
  validateCreatedBy: jest.fn(),
};

const InstitutionServiceMock = {
  create: jest.fn(),
};

const AuthServiceMock = {
  create: jest.fn(),
};

describe('ExamPaperResolver', () => {
  let resolver: ExamPaperResolver;
  let examPaperService: ExamPaperBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamPaperResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: ExamPaperBackendService,
          useValue: ExamPaperBackendServiceMock,
        },
        {
          provide: ExamService,
          useValue: ExamServiceMock,
        },
        {
          provide: InstitutionBackendService,
          useValue: InstitutionServiceMock,
        },
        {
          provide: AuthServiceBackend,
          useValue: AuthServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ExamPaperResolver>(ExamPaperResolver);
    examPaperService = module.get<ExamPaperBackendService>(
      ExamPaperBackendService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createExamPaper', () => {
    it('should create a exam-paper and emit event', async () => {
      const createExamPaperInput: CreateExamPaperInputDto = {
        name: 'john',
      } as CreateExamPaperInputDto;
      const createdExamPaper = { id: 1, name: 'john' };
      const authUser = { id: 1, email: 'email@email.com' } as UserModel;
      ExamPaperBackendServiceMock.create.mockResolvedValueOnce({
        ...createdExamPaper,
        createdById: authUser.id,
      });
      const institutionId = 1;
      const result = await resolver.createExamPaper(
        { ...createExamPaperInput, tags: [], configs: [] },
        authUser,
        institutionId,
      );

      expect(result).toEqual({
        message: 'Successfully created exam paper',
        data: { ...createdExamPaper, createdById: authUser.id },
      });
      expect(examPaperService.create).toHaveBeenCalledWith({
        ...createExamPaperInput,
        createdById: authUser.id,
        institutionId,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'exam-paper.created',
        expect.any(ExamPaperCreatedEvent),
      );
    });
  });
});
