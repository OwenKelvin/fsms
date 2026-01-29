import { Test, TestingModule } from '@nestjs/testing';
import { MpesaService } from './mpesa.service';
import { MpesaStkRequestService } from './mpesa-stk-request.service';
import { QuoteBackendService } from '@fsms/backend/quote-backend-service';

describe('MpesaService', () => {
  let service: MpesaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MpesaService,
        {
          provide: MpesaStkRequestService,
          useValue: {},
        },
        {
          provide: QuoteBackendService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MpesaService>(MpesaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
