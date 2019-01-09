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
    FROM roles r, permissions p
    WHERE r.userId = $0 AND r.permissionId = p.id AND p.id = $1`;
  const getUserPermissions = (userId) => executeQuery(getValidRolesQuery, userId);
  
  return buildPermissionService(getUserPermissions);
};
