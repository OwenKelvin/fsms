import { SettingModel } from '@fsms/backend/db';

export class SettingDeletedEvent {
  constructor(public setting: SettingModel) {}
}
