import { PasswordResetModel } from '@fsms/backend/db';

export class PasswordResetUpdatedEvent {
  constructor(public passwordReset: PasswordResetModel) {}
}
