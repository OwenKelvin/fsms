import { Test, TestingModule } from '@nestjs/testing';
import { CreditBackendService } from '@fsms/backend/credit-backend-service';
import { CreateCreditInputDto } from '../dto/create-credit-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreditCreatedEvent } from '../events/credit-created.event';
import { I18nService } from 'nestjs-i18n';
import { CreditResolver } from './credit.resolver';

const CreditBackendServiceMock = {
  create: jest.fn(),
};

describe('CreditResolver', () => {
  let resolver: CreditResolver;
  let creditService: CreditBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: CreditBackendService,
          useValue: CreditBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<CreditResolver>(CreditResolver);
    creditService = module.get<CreditBackendService>(CreditBackendService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCredit', () => {
    it('should create a credit and emit event', async () => {
      const createCreditInput: CreateCreditInputDto = {
        name: 'john',
      } as CreateCreditInputDto;
      const createdCredit = { id: 1, name: 'john' };
      CreditBackendServiceMock.create.mockResolvedValueOnce(createdCredit);

      const result = await resolver.createCredit(createCreditInput);

      expect(result).toEqual({
        message: 'Successfully created credit',
        data: createdCredit,
      });
      expect(creditService.create).toHaveBeenCalledWith(createCreditInput);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'credit.created',
        expect.any(CreditCreatedEvent),
      );
    });
  });
});
