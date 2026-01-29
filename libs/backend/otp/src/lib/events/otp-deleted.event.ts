import { OtpModel } from '@fsms/backend/db';

export class OtpDeletedEvent {
  constructor(public otp: OtpModel) {}
}
