import { InstitutionModel } from '@fsms/backend/db';

export class InstitutionUpdatedEvent {
  constructor(public institution: InstitutionModel) {}
}
