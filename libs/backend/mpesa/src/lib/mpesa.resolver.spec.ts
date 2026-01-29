import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { I18nService } from 'nestjs-i18n';
import { MpesaResolver } from './mpesa.resolver';
import { MpesaService } from '@fsms/backend/mpesa-service';
import { InstitutionBackendService } from '@fsms/backend/institution-backend-service';
import { AuthServiceBackend } from '@fsms/backend/auth-service';
import { PUB_SUB } from '@fsms/backend/util';

describe('MpesaResolver', () => {
  let resolver: MpesaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MpesaResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: MpesaService,
          useValue: {},
        },
        {
          provide: AuthServiceBackend,
          useValue: {},
        },
        {
          provide: InstitutionBackendService,
          useValue: {},
        },
        {
          provide: PUB_SUB,
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<MpesaResolver>(MpesaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
