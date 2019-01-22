// @flow
import type { UUID } from './uuid';
import type { UserID } from './user';
import type { PermissionID } from './permission';
import { toObject } from './serialization';
import { toUUID, generateUUID } from './uuid';
import { toUserId } from './user';
import { toPermissionId } from './permission';

export opaque type RoleID: UUID = UUID;

export type RoleMantle = {
  id: RoleID,
  userId: UserID,
};

export type RoleGrant = {
  id: RoleID,
  permissionId: PermissionID,
};

export type Role = {
  id: RoleID,
};

export const toRoleId = (mixed: mixed): RoleID => toUUID(mixed);

export const toRole = (mixed: mixed): Role => toObject(mixed, object => ({
  id: toRoleId(object.id),
}));

export const toRoleMantle = (mixed: mixed): RoleMantle => toObject(mixed, object => ({
  id: toRoleId(object.id),
  userId: toUserId(object.userId),
}));

export const toRoleGrant = (mixed: mixed): RoleGrant => toObject(mixed, object => ({
  id: toRoleId(object.id),
  permissionId: toPermissionId(object.permissionId),
}));

export const generateNewRole = (): Role => ({
  id: generateUUID(),
});
