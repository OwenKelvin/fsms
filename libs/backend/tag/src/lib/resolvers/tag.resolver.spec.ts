import { Test, TestingModule } from '@nestjs/testing';
import { TagBackendService } from '@fsms/backend/tag-backend-service';
import { CreateTagInputDto } from '../dto/create-tag-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TagCreatedEvent } from '../events/tag-created.event';
import { TagModel } from '@fsms/backend/db';
import { I18nService } from 'nestjs-i18n';
import { TagResolver } from './tag.resolver';
import { InstitutionBackendService } from '@fsms/backend/institution-backend-service';
import { AuthServiceBackend } from '@fsms/backend/auth-service';

describe('TagResolver', () => {
  let resolver: TagResolver;
  let tagService: TagBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: TagBackendService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: AuthServiceBackend,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: InstitutionBackendService,
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

    resolver = module.get<TagResolver>(TagResolver);
    tagService = module.get<TagBackendService>(TagBackendService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTag', () => {
    it('should create a tag and emit event', async () => {
      const createTagInput: CreateTagInputDto = {
        name: 'john',
      } as CreateTagInputDto;
      const createdTag = { id: 1, name: 'john' } as TagModel;
      jest.spyOn(tagService, 'create').mockResolvedValueOnce(createdTag);

      const result = await resolver.createTag(createTagInput);

      expect(result).toEqual({
        message: 'Successfully created tag',
        data: createdTag,
      });
      expect(tagService.create).toHaveBeenCalledWith(createTagInput);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'tag.created',
        expect.any(TagCreatedEvent),
      );
    });
  });
});
