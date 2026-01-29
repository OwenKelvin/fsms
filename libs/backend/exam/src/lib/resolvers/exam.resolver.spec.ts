import { Test, TestingModule } from '@nestjs/testing';
import { ExamResolver } from './exam.resolver';
import { ExamService } from '@fsms/backend/exam-service';
import { ExamModel, UserModel } from '@fsms/backend/db';
import { I18nService } from 'nestjs-i18n';

import { getModelToken } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InstitutionBackendService } from '@fsms/backend/institution-backend-service';
import { AuthServiceBackend } from '@fsms/backend/auth-service';

const modelRepositoryMock = {
  findAndCountAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  bulkCreate: jest.fn(),
};

const mockExamService = {
  create: jest.fn(),
  setConfigs: jest.fn(),
  setTags: jest.fn(),
};
const mockInstitutionService = {
  create: jest.fn(),
};

const mockAuthService = {
  create: jest.fn(),
};

describe('ExamResolver', () => {
  let resolver: ExamResolver;
  let examService: ExamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamResolver,
        {
          provide: getModelToken(ExamModel),
          useValue: modelRepositoryMock,
        },
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: ExamService,
          useValue: mockExamService,
        },
        {
          provide: InstitutionBackendService,
          useValue: mockInstitutionService,
        },
        {
          provide: AuthServiceBackend,
          useValue: mockAuthService,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ExamResolver>(ExamResolver);
    examService = module.get<ExamService>(ExamService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createExam', () => {
    it('should create a exam', async () => {
      const createExamInput = { name: 'New Exam' };
      const createdExam = { name: 'New Exam', id: 1 };
      const authUser = { id: 1, email: 'email@email.com' } as UserModel;
      jest.spyOn(examService, 'create').mockResolvedValueOnce({
        ...createdExam,
        createdById: authUser.id,
      } as ExamModel);

      const result = await resolver.createExam(
        { ...createExamInput, tags: [], configs: [] },
        authUser,
        1,
      );

      expect(result).toEqual({
        message: 'Successfully created exam',
        data: { ...createdExam, createdById: authUser.id },
      });
      expect(examService.create).toHaveBeenCalledWith({
        ...createExamInput,
        createdById: authUser.id,
        institutionId: 1,
      });
    });
  });
});
