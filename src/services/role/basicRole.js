// @flow
import type { RoleService } from '../role';
import type { MemoryStorageService } from '../storage/memoryStorage';
import type { RoleID, Role } from '../../lib/role';
import type { UserID } from '../../lib/user';
import type { PermissionID } from '../../lib/permission';
import { generateNewRole } from '../../lib/role';

type RoleMemoryStructure = Role & {
  permissionIds: Array<PermissionID>,
  userIds: Array<UserID>,
};

export const buildMemoryRoleService = (
  roleStorageService: MemoryStorageService<RoleID, RoleMemoryStructure>,
): RoleService => {
  const getRolesForUser = async (userId) => (
    [...roleStorageService.entries()]
      .filter(([,role]) => role.userIds.includes(userId))
      .map(([roleId]) => roleId)
  );
  const getRolesForPermission = async (permissionId) => (
    [...roleStorageService.entries()]
      .filter(([,role]) => role.permissionIds.includes(permissionId))
      .map(([roleId]) => roleId)
  );
  const getIntersectingRolesForUserAndPermission = async (userId, permissionId) => {
    const [permissionRoles, userRoles] = await Promise.all([
      getRolesForPermission(permissionId),
      getRolesForUser(userId),
    ]);

    return userRoles.filter(userRole => permissionRoles.includes(userRole));
  };

  const addUserToRole = async (userId, roleId) => {
    const role = await roleStorageService.read(roleId);
    roleStorageService.update(roleId, {
      ...role,
      userIds: [...role.userIds, userId],
    });
  };

  const addPermissionToRole = async (permissionId, roleId) => {
    const role = await roleStorageService.read(roleId);
    roleStorageService.update(roleId, {
      ...role,
      permissionIds: [...role.permissionIds, permissionId],
    });
  };

  const addRole = async () => {
    const newRole = generateNewRole();
    roleStorageService.create(newRole.id, { ...newRole, permissionIds: [], userIds: [] });
    return newRole;
  };

  return {
    getRolesForUser,
    getRolesForPermission,
    getIntersectingRolesForUserAndPermission,
    addUserToRole,
    addPermissionToRole,
    addRole,
  };
};
