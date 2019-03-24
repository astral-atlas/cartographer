// @flow
import type { UserID } from '../lib/user';
import type { RoleID, Role } from '../lib/role';
import type { PermissionID } from '../lib/permission';

export type RoleService = {
  getRole: (roleId: RoleID) => Promise<Role>,
  getRolesForUser: (userId: UserID) => Promise<Array<RoleID>>,
  getRolesForPermission: (permissionId: PermissionID) => Promise<Array<RoleID>>,
  getIntersectingRolesForUserAndPermission: (userId: UserID, permissionId: PermissionID) => Promise<Array<RoleID>>,
  addUserToRole: (userId: UserID, roleId: RoleID) => Promise<void>,
  addPermissionToRole: (permissionId: PermissionID, roleId: RoleID) => Promise<void>,
  addRole: () => Promise<Role>,
};

export const userHasValidRoleForPermission = async (
  roleService: RoleService,
  userId: UserID,
  permissionId: PermissionID,
): Promise<boolean> => (
  (
    await roleService.getIntersectingRolesForUserAndPermission(userId, permissionId)
  ).length > 0
);
export const userHasPermission = userHasValidRoleForPermission;

export const addRoleWithPermissionsAndUsers = async (
  roleService: RoleService,
  userIds: Array<UserID>,
  permissionIds: Array<PermissionID>,
): Promise<Role> => {
  const role = await roleService.addRole();
  const userPromises = userIds.map(userId => roleService.addUserToRole(userId, role.id));
  const permissionPromises = permissionIds.map(permissionId => roleService.addPermissionToRole(permissionId, role.id));

  await Promise.all([...userPromises, ...permissionPromises]);
  
  return role;
};
