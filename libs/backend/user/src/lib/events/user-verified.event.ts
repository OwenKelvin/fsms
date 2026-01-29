import { UserModel } from '@fsms/backend/db';

export class UserVerifiedEvent {
  constructor(public user: UserModel) {}
}
