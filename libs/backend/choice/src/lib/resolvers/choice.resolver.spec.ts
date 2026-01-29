import { Test, TestingModule } from '@nestjs/testing';
import { ChoiceBackendService } from '@fsms/backend/choice-backend-service';
import { CreateChoiceInputDto } from '../dto/create-choice-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChoiceCreatedEvent } from '../events/choice-created.event';
import { I18nService } from 'nestjs-i18n';
import { ChoiceResolver } from './choice.resolver';

const ChoiceBackendServiceMock = {
  create: jest.fn(),
};

describe('ChoiceResolver', () => {
  let resolver: ChoiceResolver;
  let choiceService: ChoiceBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChoiceResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: ChoiceBackendService,
          useValue: ChoiceBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ChoiceResolver>(ChoiceResolver);
    choiceService = module.get<ChoiceBackendService>(ChoiceBackendService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createChoice', () => {
    it('should create a choice and emit event', async () => {
      const createChoiceInput: CreateChoiceInputDto = {
        name: 'john',
      } as CreateChoiceInputDto;
      const createdChoice = { id: 1, name: 'john' };
      ChoiceBackendServiceMock.create.mockResolvedValueOnce(createdChoice);

      const result = await resolver.createChoice(createChoiceInput);

      expect(result).toEqual({
        message: 'Successfully created choice',
        data: createdChoice,
      });
      expect(choiceService.create).toHaveBeenCalledWith(createChoiceInput);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'choice.created',
        expect.any(ChoiceCreatedEvent),
      );
    });
  });
});
