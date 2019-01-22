// @flow
import type { UserID } from '../lib/user';
import type { RoleID, Role } from '../lib/role';
import type { PermissionID } from '../lib/permission';

export type RoleService = {
  getRolesForUser: (userId: UserID) => Promise<Array<RoleID>>,
  getRolesForPermission: (permissionId: PermissionID) => Promise<Array<RoleID>>,
  getIntersectingRolesForUserAndPermission: (userId: UserID, permissionId: PermissionID) => Promise<Array<RoleID>>,
  addUserToRole: (userId: UserID, roleId: RoleID) => Promise<void>,
  addPermissionToRole: (permissionId: PermissionID, roleId: RoleID) => Promise<void>,
  addRole: () => Promise<Role>,
};
