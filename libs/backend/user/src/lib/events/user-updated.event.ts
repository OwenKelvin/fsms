import { UserModel } from '@fsms/backend/db';

export class UserUpdatedEvent {
  constructor(public user: UserModel) {
  }
}
