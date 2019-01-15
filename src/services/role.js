// @flow
import type { UserID } from '../lib/user';
import type { RoleID } from '../lib/role';
import type { PermissionID } from '../lib/permission';

export type RoleService = {
  getUserRoles: (userId: UserID) => Promise<Array<RoleID>>,
  getValidRolesForPermission: (userId: UserID, permissionId: PermissionID) => Promise<Array<RoleID>>,
  addUserToRole: (userId: UserID, roleId: RoleID) => Promise<void>,
  addPermissionToRole: (permissionId: PermissionID, roleId: RoleID) => Promise<void>,
};
