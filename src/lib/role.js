// @flow
import type { UUID } from './uuid';
import type { PermissionID } from './permission';
import { toObject } from './serialization';
import { toUUID, generateUUID } from './uuid';
import { toPermissionId } from './permission';

export opaque type RoleID: UUID = UUID;

export type Role = {
  id: RoleID,
  readPermission: PermissionID,
  editPermission: PermissionID,
};

export const toRoleId = (mixed: mixed): RoleID => toUUID(mixed);

export const toRole = (mixed: mixed): Role => toObject(mixed, object => ({
  id: toRoleId(object.id),
  readPermission: toPermissionId(object.readPermission),
  editPermission: toPermissionId(object.editPermission),
}));

export const generateRole = () => ({
  id: generateUUID(),
});
