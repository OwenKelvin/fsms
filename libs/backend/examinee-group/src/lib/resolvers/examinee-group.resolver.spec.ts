import { Test, TestingModule } from '@nestjs/testing';
import { ExamineeGroupBackendService } from '@fsms/backend/examinee-group-backend-service';
import { CreateExamineeGroupInputDto } from '../dto/create-examinee-group-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExamineeGroupCreatedEvent } from '../events/examinee-group-created.event';
import { I18nService } from 'nestjs-i18n';
import { ExamineeGroupResolver } from './examinee-group.resolver';
import { InstitutionBackendService } from '@fsms/backend/institution-backend-service';
import { AuthServiceBackend } from '@fsms/backend/auth-service';

const ExamineeGroupBackendServiceMock = {
  create: jest.fn(),
  saveExaminees: jest.fn(),
};
const authBackendServiceMock = {
  create: jest.fn(),
};
const institutionBackendServiceMock = {
  create: jest.fn(),
};
describe('ExamineeGroupResolver', () => {
  let resolver: ExamineeGroupResolver;
  let examineeGroupService: ExamineeGroupBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamineeGroupResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: ExamineeGroupBackendService,
          useValue: ExamineeGroupBackendServiceMock,
        },
        {
          provide: InstitutionBackendService,
          useValue: institutionBackendServiceMock,
        },
        {
          provide: AuthServiceBackend,
          useValue: authBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ExamineeGroupResolver>(ExamineeGroupResolver);
    examineeGroupService = module.get<ExamineeGroupBackendService>(
      ExamineeGroupBackendService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createExamineeGroup', () => {
    it('should create a examinee-group and emit event', async () => {
      const createExamineeGroupInput: CreateExamineeGroupInputDto = {
        name: 'john',
      } as CreateExamineeGroupInputDto;
      const createdExamineeGroup = { id: 1, name: 'john' };
      ExamineeGroupBackendServiceMock.create.mockResolvedValueOnce(
        createdExamineeGroup,
      );

      const institutionId = 1;

      const result = await resolver.createExamineeGroup(
        createExamineeGroupInput,
        institutionId,
      );

      expect(result).toEqual({
        message: 'Successfully created examinee group',
        data: createdExamineeGroup,
      });
      expect(examineeGroupService.create).toHaveBeenCalledWith({
        ...createExamineeGroupInput,
        institutionId,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'examinee-group.created',
        expect.any(ExamineeGroupCreatedEvent),
      );
    });
  });
});
