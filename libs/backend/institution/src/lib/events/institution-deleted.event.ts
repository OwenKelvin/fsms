import { InstitutionModel } from '@fsms/backend/db';

export class InstitutionDeletedEvent {
  constructor(public institution: InstitutionModel) {}
}
