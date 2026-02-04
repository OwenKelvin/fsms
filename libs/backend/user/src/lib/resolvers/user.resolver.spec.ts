import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from '@fsms/backend/user-service';
import { CreateUserInputDto } from '../dto/create-user-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserModel } from '@fsms/backend/db';
import { I18nService } from 'nestjs-i18n';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user and emit event', async () => {
      const createUserInput: CreateUserInputDto = {
        firstName: 'john',
        lastName: 'Doe',
      } as CreateUserInputDto;
      const createdUser = {
        id: 1,
        firstName: 'john',
        lastName: 'Doe',
      } as UserModel;
      jest.spyOn(userService, 'create').mockResolvedValueOnce(createdUser);

      const result = await resolver.createUser(createUserInput);

      expect(result).toEqual({
        message: 'Successfully created user',
        data: createdUser,
      });
      expect(userService.create).toHaveBeenCalledWith(createUserInput);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'user.created',
        expect.any(UserCreatedEvent),
      );
    });
  });
});
