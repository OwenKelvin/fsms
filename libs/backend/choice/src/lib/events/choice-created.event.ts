import { ChoiceModel } from '@fsms/backend/db';

export class ChoiceCreatedEvent {
  constructor(public choice: ChoiceModel) {}
}
