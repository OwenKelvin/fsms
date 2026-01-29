import { PermissionModel, RoleModel, UserModel } from '../models';

export class Profile {
  userInfo?: UserModel;
  permissions?: PermissionModel[];
  roles?: RoleModel[];
}
