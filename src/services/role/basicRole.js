// @flow
import type { RoleService } from '../role';
import type { StorageService } from '../storage';
import type { RoleID, Role } from '../../lib/role';
import type { UserID } from '../../lib/user';
import type { PermissionID } from '../../lib/permission';

export const buildBasicRoleService = (
  roleStorageService: StorageService<RoleID, Role>,
  getUserRoles: (userId: UserID) => Promise<Array<RoleID>>,
  getPermissionRoles: (permissionId: PermissionID) => Promise<Array<RoleID>>,
): RoleService => {
  const getRolesForUser = getUserRoles;
  const getRolesForPermission = getPermissionRoles;

  const addPermissionToRole = async (permissionId, roleId) => {
    
  };

  return {
    getRolesForUser,
    getRolesForPermission,
    addPermissionToRole,
  };
};
