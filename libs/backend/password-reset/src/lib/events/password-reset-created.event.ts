import { PasswordResetModel } from '@fsms/backend/db';

export class PasswordResetCreatedEvent {
  constructor(public passwordReset: PasswordResetModel) {}
}
