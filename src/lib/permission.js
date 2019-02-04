// @flow
import type { UUID } from './uuid';
import type { UserID } from './user';
import type { RoleID } from './role';
import { toObject } from './serialization';
import { toUUID, generateUUID } from './uuid';

export opaque type PermissionID: UUID = UUID;

export type Permission = {
  id: PermissionID,
};

export const toPermissionId = (mixed: mixed): PermissionID => toUUID(mixed);

export const toPermission = (mixed: mixed): Permission => toObject(mixed, object => ({
  id: toPermissionId(object.id),
}));

export const generatePermission = (): Permission => ({
  id: generateUUID(),
});

export const buildBasicPermissionIndex = <T>(
  getItems: () => Promise<Array<T>>,
  getPermissionId: (item: T) => PermissionID,
  getUserRoleIntersection: (userId: UserID, permissionId: PermissionID) => Promise<Array<RoleID>>,
): (userId: UserID) => Promise<Array<T>>  => async (userId) => {
    const items = await getItems();
    const permissionIds = items.map<PermissionID>(getPermissionId);
    const roleIntersections = await Promise.all(permissionIds.map<Promise<Array<RoleID>>>(permissionId => (
      getUserRoleIntersection(userId, permissionId)
    )));
    return items.filter((_, index) => roleIntersections[index].length > 0);
  };
