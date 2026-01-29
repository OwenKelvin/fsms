import { ConfigModel } from '@fsms/backend/db';

export class ConfigUpdatedEvent {
  constructor(public config: ConfigModel) {}
}
