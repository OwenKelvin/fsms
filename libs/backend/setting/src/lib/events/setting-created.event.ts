import { SettingModel } from '@fsms/backend/db';

export class SettingCreatedEvent {
  constructor(public setting: SettingModel) {}
}
