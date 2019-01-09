// @flow
import type { Storage } from './storage.js';
type PermissionID = string;
type UserID = string;

export type PermissionService = {
  userHasPermission: (userId: UserID, permissionId: PermissionID) => Promise<boolean>,
};

export const buildPermissionService = (
  getUserPermissions: (userId: UserID) => Promise<Set<PermissionID>>,
): PermissionService => {
  const userHasPermission = async (userId, permissionId) => {
    const userPermissions = await getUserPermissions(userId);
    return userPermissions.has(permissionId);
  };

  return {
    userHasPermission,
  };
};

export const buildRolePermissionServiceFromTable = (
  executeQuery: (query: string, ...args: Array<string>) => Promise<{ rows: Array<mixed> }>,
): PermissionService => {
  const getValidRolesQuery = `
    SELECT role.id, role.name
    FROM users u, roles r, permissions p
    WHERE u.id = r.userId AND r.permissionId = p.id`;
  const getUserPermissions = (userId) => executeQuery(getValidRolesQuery, userId);
  
  return buildPermissionService(getUserPermissions);
};
