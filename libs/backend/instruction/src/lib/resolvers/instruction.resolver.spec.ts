import { Test, TestingModule } from '@nestjs/testing';
import { InstructionBackendService } from '@fsms/backend/instruction-backend-service';
import { CreateInstructionInputDto } from '../dto/create-instruction-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InstructionCreatedEvent } from '../events/instruction-created.event';
import { I18nService } from 'nestjs-i18n';
import { InstructionResolver } from './instruction.resolver';
import { UserModel } from '@fsms/backend/db';

const InstructionBackendServiceMock = {
  create: jest.fn(),
};

describe('InstructionResolver', () => {
  let resolver: InstructionResolver;
  let instructionService: InstructionBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstructionResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: InstructionBackendService,
          useValue: InstructionBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<InstructionResolver>(InstructionResolver);
    instructionService = module.get<InstructionBackendService>(
      InstructionBackendService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createInstruction', () => {
    it('should create a instruction and emit event', async () => {
      const createInstructionInput: CreateInstructionInputDto = {
        description: 'john',
      } as CreateInstructionInputDto;
      const loggedInUser = { id: 1 } as UserModel;
      const createdInstruction = {
        id: 1,
        description: 'john',
        createdById: loggedInUser.id,
      };
      InstructionBackendServiceMock.create.mockResolvedValueOnce(
        createdInstruction,
      );

      const result = await resolver.createInstruction(
        createInstructionInput,
        loggedInUser,
      );

      expect(result).toEqual({
        message: 'Successfully created instruction',
        data: createdInstruction,
      });
      expect(instructionService.create).toHaveBeenCalledWith({
        ...createInstructionInput,
        createdById: loggedInUser.id,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'instruction.created',
        expect.any(InstructionCreatedEvent),
      );
    });
  });
});
