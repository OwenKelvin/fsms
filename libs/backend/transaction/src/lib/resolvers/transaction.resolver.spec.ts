import { Test, TestingModule } from '@nestjs/testing';
import { TransactionBackendService } from '@fsms/backend/transaction-backend-service';
import { CreateTransactionInputDto } from '../dto/create-transaction-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransactionCreatedEvent } from '../events/transaction-created.event';
import { I18nService } from 'nestjs-i18n';
import { TransactionResolver } from './transaction.resolver';

const TransactionBackendServiceMock = {
  create: jest.fn(),
};

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let transactionService: TransactionBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: TransactionBackendService,
          useValue: TransactionBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TransactionResolver>(TransactionResolver);
    transactionService = module.get<TransactionBackendService>(
      TransactionBackendService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction and emit event', async () => {
      const createTransactionInput: CreateTransactionInputDto = {
        name: 'john',
      } as CreateTransactionInputDto;
      const createdTransaction = { id: 1, name: 'john' };
      TransactionBackendServiceMock.create.mockResolvedValueOnce(
        createdTransaction,
      );

      const result = await resolver.createTransaction(createTransactionInput);

      expect(result).toEqual({
        message: 'Successfully created transaction',
        data: createdTransaction,
      });
      expect(transactionService.create).toHaveBeenCalledWith(
        createTransactionInput,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'transaction.created',
        expect.any(TransactionCreatedEvent),
      );
    });
  });
});
