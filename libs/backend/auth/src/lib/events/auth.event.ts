import { InstitutionModel, UserModel } from '@fsms/backend/db';

export class AuthEvent {
  constructor(
    public user: UserModel,
    public institution?: InstitutionModel,
  ) {}
}
