import { Test, TestingModule } from '@nestjs/testing';
import { PlanBackendService } from '@fsms/backend/plan-backend-service';
import { CreatePlanInputDto } from '../dto/create-plan-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlanCreatedEvent } from '../events/plan-created.event';
import { I18nService } from 'nestjs-i18n';
import { PlanResolver } from './plan.resolver';

const PlanBackendServiceMock = {
  create: jest.fn(),
};

describe('PlanResolver', () => {
  let resolver: PlanResolver;
  let planService: PlanBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: PlanBackendService,
          useValue: PlanBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PlanResolver>(PlanResolver);
    planService = module.get<PlanBackendService>(PlanBackendService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createPlan', () => {
    it('should create a plan and emit event', async () => {
      const createPlanInput: CreatePlanInputDto = {
        name: 'john',
      } as CreatePlanInputDto;
      const createdPlan = { id: 1, name: 'john' };
      PlanBackendServiceMock.create.mockResolvedValueOnce(createdPlan);

      const result = await resolver.createPlan(createPlanInput);

      expect(result).toEqual({
        message: 'Successfully created plan',
        data: createdPlan,
      });
      expect(planService.create).toHaveBeenCalledWith(createPlanInput);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'plan.created',
        expect.any(PlanCreatedEvent),
      );
    });
  });
});
