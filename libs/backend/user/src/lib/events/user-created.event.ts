import { UserModel } from '@fsms/backend/db';

export class UserCreatedEvent {
  constructor(public user: UserModel) {
  }
}
