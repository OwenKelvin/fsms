import { OtpModel } from '@fsms/backend/db';

export class OtpUpdatedEvent {
  constructor(public otp: OtpModel) {}
}
