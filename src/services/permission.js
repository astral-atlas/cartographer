// @flow
import type { UserID } from '../lib/user';
import type { PermissionID } from '../lib/permission';
import type { RoleID } from '../lib/role';

export type PermissionService = {
  getRolesForPermission: (userId: UserID, permissionId: PermissionID) => Promise<Array<RoleID>>,
};
