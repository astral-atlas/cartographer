// @flow
import type { RoleService } from '../role';
import type { StorageService } from '../storage';
import type { RoleID, Role } from '../../lib/role';
import type { UserID } from '../../lib/user';
import type { PermissionID } from '../../lib/permission';
import { generateNewRole } from '../../lib/role';

export type RoleMemoryStructure = {
  role: Role,
  permissionIds: Array<PermissionID>,
  userIds: Array<UserID>,
};

export const createRoleService = (
  roles: StorageService<RoleID, RoleMemoryStructure>,
  getRolesForUser: (userId: UserID) => Promise<Array<RoleID>>,
  getRolesForPermission: (permissionId: PermissionID) => Promise<Array<RoleID>>,
): RoleService => {
  const getRole = async (roleId) => {
    return (await roles.read(roleId)).role;
  };

  const getIntersectingRolesForUserAndPermission = async (userId, permissionId) => {
    const [permissionRoles, userRoles] = await Promise.all([
      getRolesForPermission(permissionId),
      getRolesForUser(userId),
    ]);

    return userRoles.filter(userRole => permissionRoles.includes(userRole));
  };

  const addUserToRole = async (userId, roleId) => {
    await roles.update(roleId, role => ({
      ...role,
      userIds: [...role.userIds, userId],
    }));
  };

  const addPermissionToRole = async (permissionId, roleId) => {
    await roles.update(roleId, role => ({
      ...role,
      permissionIds: [...role.permissionIds, permissionId],
    }));
  };

  const addRole = async () => {
    const newRole = generateNewRole();
    await roles.create(newRole.id, { role: newRole, permissionIds: [], userIds: [] });
    return newRole;
  };

  return {
    getRole,
    getRolesForUser,
    getRolesForPermission,
    getIntersectingRolesForUserAndPermission,
    addUserToRole,
    addPermissionToRole,
    addRole,
  };
};
