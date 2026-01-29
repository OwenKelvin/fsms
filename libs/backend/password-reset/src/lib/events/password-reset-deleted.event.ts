import { PasswordResetModel } from '@fsms/backend/db';

export class PasswordResetDeletedEvent {
  constructor(public passwordReset: PasswordResetModel) {}
}
