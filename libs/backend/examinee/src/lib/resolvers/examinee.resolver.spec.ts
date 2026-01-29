import { Test, TestingModule } from '@nestjs/testing';
import { ExamineeBackendService } from '@fsms/backend/examinee-backend-service';
import { CreateExamineeInputDto } from '../dto/create-examinee-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExamineeCreatedEvent } from '../events/examinee-created.event';
import { I18nService } from 'nestjs-i18n';
import { ExamineeResolver } from './examinee.resolver';

const ExamineeBackendServiceMock = {
  create: jest.fn(),
};

describe('ExamineeResolver', () => {
  let resolver: ExamineeResolver;
  let examineeService: ExamineeBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamineeResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: ExamineeBackendService,
          useValue: ExamineeBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ExamineeResolver>(ExamineeResolver);
    examineeService = module.get<ExamineeBackendService>(
      ExamineeBackendService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createExaminee', () => {
    it('should create a examinee and emit event', async () => {
      const createExamineeInput: CreateExamineeInputDto = {
        uniqueIdentifier: 'john',
      } as CreateExamineeInputDto;
      const createdExaminee = { id: 1, uniqueIdentifier: 'john' };
      ExamineeBackendServiceMock.create.mockResolvedValueOnce(createdExaminee);

      const result = await resolver.createExaminee(createExamineeInput);

      expect(result).toEqual({
        message: 'Successfully created examinee',
        data: createdExaminee,
      });
      expect(examineeService.create).toHaveBeenCalledWith(createExamineeInput);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'examinee.created',
        expect.any(ExamineeCreatedEvent),
      );
    });
  });
});
