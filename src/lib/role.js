// @flow
import type { UUID } from './uuid';
import type { UserID } from './user';
import type { PermissionID } from './permission';
import { toObject } from './serialization';
import { toUUID, generateUUID } from './uuid';
import { toUserId } from './user';
import { toPermissionId } from './permission';

export opaque type RoleID: UUID = UUID;

export type Role = {
  id: RoleID,
  userId: UserID,
  permissionId: PermissionID,
};

export const toRoleId = (mixed: mixed): RoleID => toUUID(mixed);

export const toRole = (mixed: mixed): Role => toObject(mixed, object => ({
  id: toRoleId(object.id),
  userId: toUserId(object.userId),
  permissionId: toPermissionId(object.permissionId),
}));

export const generateRole = () => ({
  id: generateUUID(),
});
