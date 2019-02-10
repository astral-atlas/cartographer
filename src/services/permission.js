// @flow
import type { Permission, PermissionID } from '../lib/permission';
export type PermissionService = {
  addNewPermission: () => Promise<Permission>,
  getPermission: (permissionId: PermissionID) => Promise<Permission>,
};
