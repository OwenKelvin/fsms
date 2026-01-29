import { ChoiceModel } from '@fsms/backend/db';

export class ChoiceDeletedEvent {
  constructor(public choice: ChoiceModel) {}
}
