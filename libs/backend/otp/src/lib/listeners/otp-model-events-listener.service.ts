import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OtpCreatedEvent } from '../events/otp-created.event';

@Injectable()
export class OtpModelEventsListener {
  @OnEvent('otp.created')
  async handleOtpCreated($event: OtpCreatedEvent) {
    Logger.log('OTP created event event => id', $event.otp.id);
  }
}
