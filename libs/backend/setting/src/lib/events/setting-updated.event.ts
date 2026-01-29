import { SettingModel } from '@fsms/backend/db';

export class SettingUpdatedEvent {
  constructor(public setting: SettingModel) {}
}
