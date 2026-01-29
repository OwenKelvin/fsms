import { ConfigModel } from '@fsms/backend/db';

export class ConfigCreatedEvent {
  constructor(public config: ConfigModel) {}
}
