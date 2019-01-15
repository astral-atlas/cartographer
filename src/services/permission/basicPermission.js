// @flow
import type { PermissionService } from '../permission';
import type { UserID } from '../../lib/user';
import type { PermissionID } from '../../lib/permission';
import type { RoleID } from '../../lib/role';

export const buildBasicPermissionService = (
  getUserRoles: (userId: UserID) => Promise<Array<RoleID>>,
  getPermissionRoles: (permissionId: PermissionID) => Promise<Array<RoleID>>,
): PermissionService => {
  const getRolesForPermission = async (userId, permissionId) => {
    const userRolesIds = await getUserRoles(userId);
    const permissionRolesIds = await getPermissionRoles(permissionId);

    const roleIds = userRolesIds.filter(roleId => permissionRolesIds.includes(roleId));
    return roleIds;
  };

  return {
    getRolesForPermission,
  };
};
