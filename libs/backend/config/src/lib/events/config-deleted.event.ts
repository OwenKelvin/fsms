import { ConfigModel } from '@fsms/backend/db';

export class ConfigDeletedEvent {
  constructor(public config: ConfigModel) {}
}
