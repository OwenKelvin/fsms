import { OtpModel } from '@fsms/backend/db';

export class OtpCreatedEvent {
  constructor(public otp: OtpModel) {}
}
