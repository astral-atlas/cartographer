// @flow
import type { Permission } from '../lib/permission';
export type PermissionService = {
  addNewPermission: () => Promise<Permission>,
};
