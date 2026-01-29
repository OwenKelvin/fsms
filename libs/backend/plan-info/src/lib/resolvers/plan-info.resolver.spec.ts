import { Test, TestingModule } from '@nestjs/testing';
import { PlanInfoBackendService } from '@fsms/backend/plan-info-backend-service';
import { CreatePlanInfoInputDto } from '../dto/create-plan-info-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlanInfoCreatedEvent } from '../events/plan-info-created.event';
import { I18nService } from 'nestjs-i18n';
import { PlanInfoResolver } from './plan-info.resolver';

const PlanInfoBackendServiceMock = {
  create: jest.fn(),
};

describe('PlanInfoResolver', () => {
  let resolver: PlanInfoResolver;
  let planInfoService: PlanInfoBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanInfoResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: PlanInfoBackendService,
          useValue: PlanInfoBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PlanInfoResolver>(PlanInfoResolver);
    planInfoService = module.get<PlanInfoBackendService>(
      PlanInfoBackendService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createPlanInfo', () => {
    it('should create a plan-info and emit event', async () => {
      const createPlanInfoInput: CreatePlanInfoInputDto = {
        name: 'john',
      } as CreatePlanInfoInputDto;
      const createdPlanInfo = { id: 1, name: 'john' };
      PlanInfoBackendServiceMock.create.mockResolvedValueOnce(createdPlanInfo);

      const result = await resolver.createPlanInfo(createPlanInfoInput);

      expect(result).toEqual({
        message: 'Successfully created plan-info',
        data: createdPlanInfo,
      });
      expect(planInfoService.create).toHaveBeenCalledWith(createPlanInfoInput);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'plan-info.created',
        expect.any(PlanInfoCreatedEvent),
      );
    });
  });
});
