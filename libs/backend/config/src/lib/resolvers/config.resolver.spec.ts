import { Test, TestingModule } from '@nestjs/testing';
import { ConfigBackendService } from '@fsms/backend/config-backend-service';
import { CreateConfigInputDto } from '../dto/create-config-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigCreatedEvent } from '../events/config-created.event';
import { I18nService } from 'nestjs-i18n';
import { ConfigResolver } from './config.resolver';

const ConfigBackendServiceMock = {
  create: jest.fn(),
};

describe('ConfigResolver', () => {
  let resolver: ConfigResolver;
  let configService: ConfigBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: ConfigBackendService,
          useValue: ConfigBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ConfigResolver>(ConfigResolver);
    configService = module.get<ConfigBackendService>(ConfigBackendService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createConfig', () => {
    it('should create a config and emit event', async () => {
      const createConfigInput: CreateConfigInputDto = {
        name: 'john',
      } as CreateConfigInputDto;
      const createdConfig = { id: 1, name: 'john' };
      ConfigBackendServiceMock.create.mockResolvedValueOnce(createdConfig);

      const result = await resolver.createConfig(createConfigInput);

      expect(result).toEqual({
        message: 'Successfully created config',
        data: createdConfig,
      });
      expect(configService.create).toHaveBeenCalledWith(createConfigInput);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'config.created',
        expect.any(ConfigCreatedEvent)
      );
    });
  });
});
