// @flow
import type { PermissionService } from '../permission';
import type { UserID } from '../../lib/user';
import type { PermissionID, Permission } from '../../lib/permission';
import type { RoleID } from '../../lib/role';
import type { StorageService } from '../storage';
import { buildNewPermission } from '../../lib/permission';

export const buildBasicPermissionService = (
  permissionStorageService: StorageService<PermissionID, Permission>,
  getUserRoles: (userId: UserID) => Promise<Array<RoleID>>,
  getPermissionRoles: (permissionId: PermissionID) => Promise<Array<RoleID>>,
): PermissionService => {
  const getRolesForPermission = async (userId, permissionId) => {
    const userRolesIds = await getUserRoles(userId);
    const permissionRolesIds = await getPermissionRoles(permissionId);

    const roleIds = userRolesIds.filter(roleId => permissionRolesIds.includes(roleId));
    return roleIds;
  };
  const addNewPermission = async () => {
    const newPermission = buildNewPermission();
    permissionStorageService.create(newPermission.id, newPermission);
    return newPermission;
  };
  return {
    getRolesForPermission,
    addNewPermission,
  };
};
