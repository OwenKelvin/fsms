import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionBackendService } from '@fsms/backend/institution-backend-service';
import { CreateInstitutionInputDto } from '../dto/create-institution-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InstitutionCreatedEvent } from '../events/institution-created.event';
import { I18nService } from 'nestjs-i18n';
import { InstitutionResolver } from './institution.resolver';

const InstitutionBackendServiceMock = {
  create: jest.fn(),
};

describe('InstitutionResolver', () => {
  let resolver: InstitutionResolver;
  let institutionService: InstitutionBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstitutionResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: InstitutionBackendService,
          useValue: InstitutionBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<InstitutionResolver>(InstitutionResolver);
    institutionService = module.get<InstitutionBackendService>(
      InstitutionBackendService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createInstitution', () => {
    it('should create a institution and emit event', async () => {
      const createInstitutionInput: CreateInstitutionInputDto = {
        name: 'john',
      } as CreateInstitutionInputDto;
      const createdInstitution = { id: 1, name: 'john' };
      InstitutionBackendServiceMock.create.mockResolvedValueOnce(
        createdInstitution,
      );

      const result = await resolver.createInstitution(createInstitutionInput);

      expect(result).toEqual({
        message: 'Successfully created institution',
        data: createdInstitution,
      });
      expect(institutionService.create).toHaveBeenCalledWith(
        createInstitutionInput,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'institution.created',
        expect.any(InstitutionCreatedEvent),
      );
    });
  });
});
