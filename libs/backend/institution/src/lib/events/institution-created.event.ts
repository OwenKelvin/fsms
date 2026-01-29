import { InstitutionModel } from '@fsms/backend/db';

export class InstitutionCreatedEvent {
  constructor(public institution: InstitutionModel) {}
}
