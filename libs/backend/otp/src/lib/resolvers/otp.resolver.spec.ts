import { Test, TestingModule } from '@nestjs/testing';
import { OtpBackendService } from '@fsms/backend/otp-backend-service';
// import { CreateOtpInputDto } from '../dto/create-otp-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { OtpCreatedEvent } from '../events/otp-created.event';
import { I18nService } from 'nestjs-i18n';
import { OtpResolver } from './otp.resolver';

// const otpBackendServiceMock = {
//   create: jest.fn(),
// }

describe('OtpResolver', () => {
  let resolver: OtpResolver;
  // let otpService: OtpBackendService;
  // let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: OtpBackendService,
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

    resolver = module.get<OtpResolver>(OtpResolver);
    // otpService = module.get<OtpBackendService>(OtpBackendService);
    // eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // describe('createOtp', () => {
  //   it('should create a otp and emit event', async () => {
  //     const createOtpInput: CreateOtpInputDto = {
  //       name: 'john',
  //     } as CreateOtpInputDto;
  //     const createdOtp = { id: 1, name: 'john' };
  //     otpBackendServiceMock.create.mockResolvedValueOnce(createdOtp);
  //
  //     const result = await resolver.createOtp(createOtpInput);
  //
  //     expect(result).toEqual({
  //       message: 'Successfully created otp',
  //       data: createdOtp,
  //     });
  //     expect(otpService.create).toHaveBeenCalledWith(createOtpInput);
  //     expect(eventEmitter.emit).toHaveBeenCalledWith(
  //       'otp.created',
  //       expect.any(OtpCreatedEvent)
  //     );
  //   });
  // });
});
