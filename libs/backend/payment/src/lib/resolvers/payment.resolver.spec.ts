import { Test, TestingModule } from '@nestjs/testing';
import { PaymentBackendService } from '@fsms/backend/payment-backend-service';
import { CreatePaymentInputDto } from '../dto/create-payment-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentCreatedEvent } from '../events/payment-created.event';
import { I18nService } from 'nestjs-i18n';
import { PaymentResolver } from './payment.resolver';

const PaymentBackendServiceMock = {
  create: jest.fn(),
};

describe('PaymentResolver', () => {
  let resolver: PaymentResolver;
  let paymentService: PaymentBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: PaymentBackendService,
          useValue: PaymentBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PaymentResolver>(PaymentResolver);
    paymentService = module.get<PaymentBackendService>(PaymentBackendService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a payment and emit event', async () => {
      const createPaymentInput: CreatePaymentInputDto = {
        name: 'john',
      } as CreatePaymentInputDto;
      const createdPayment = { id: 1, name: 'john' };
      PaymentBackendServiceMock.create.mockResolvedValueOnce(createdPayment);

      const result = await resolver.createPayment(createPaymentInput);

      expect(result).toEqual({
        message: 'Successfully created payment',
        data: createdPayment,
      });
      expect(paymentService.create).toHaveBeenCalledWith(createPaymentInput);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'payment.created',
        expect.any(PaymentCreatedEvent),
      );
    });
  });
});
