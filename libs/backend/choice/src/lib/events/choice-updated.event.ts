import { ChoiceModel } from '@fsms/backend/db';

export class ChoiceUpdatedEvent {
  constructor(public choice: ChoiceModel) {}
}
