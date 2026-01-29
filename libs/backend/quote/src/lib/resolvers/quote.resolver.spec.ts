import { Test, TestingModule } from '@nestjs/testing';
import { QuoteBackendService } from '@fsms/backend/quote-backend-service';
import { CreateQuoteInputDto } from '../dto/create-quote-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { QuoteCreatedEvent } from '../events/quote-created.event';
import { I18nService } from 'nestjs-i18n';
import { QuoteResolver } from './quote.resolver';
import { PlanBackendService } from '@fsms/backend/plan-backend-service';
import { InstitutionBackendService } from '@fsms/backend/institution-backend-service';
import { AuthServiceBackend } from '@fsms/backend/auth-service';

const QuoteBackendServiceMock = {
  create: jest.fn(),
};
const PlanBackendServiceMock = {
  findById: jest.fn(),
};
const InstitutionBackendServiceMock = {
  findById: jest.fn(),
};
const AuthServiceBackendMock = {
  findById: jest.fn(),
};

PlanBackendServiceMock.findById.mockReturnValue({
  name: 'Plan A',
  costPerCreditInKES: 2.5,
});

describe('QuoteResolver', () => {
  let resolver: QuoteResolver;
  let quoteService: QuoteBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: QuoteBackendService,
          useValue: QuoteBackendServiceMock,
        },
        {
          provide: PlanBackendService,
          useValue: PlanBackendServiceMock,
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
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<QuoteResolver>(QuoteResolver);
    quoteService = module.get<QuoteBackendService>(QuoteBackendService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createQuote', () => {
    it('should create a quote and emit event', async () => {
      const createQuoteInput: CreateQuoteInputDto = {
        creditAmount: 100,
        planId: 1,
      } as CreateQuoteInputDto;
      const institutionId = 1;
      const createdQuote = {
        id: 1,
        creditCost: 250,
        planId: 1,
        currency: 'KES',
        taxCost: 40,
        totalCost: 290,
      };
      QuoteBackendServiceMock.create.mockResolvedValueOnce(createdQuote);

      const result = await resolver.createQuote(
        createQuoteInput,
        institutionId,
      );

      expect(result).toEqual({
        message: 'Successfully created quote',
        data: createdQuote,
      });
      expect(quoteService.create).toHaveBeenCalledWith(
        expect.objectContaining(createQuoteInput),
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'quote.created',
        expect.any(QuoteCreatedEvent),
      );
    });
  });
});
