// @flow
import type { UUID } from './uuid';
import { toObject } from './serialization';
import { toUUID } from './uuid';

export opaque type PermissionID: UUID = UUID;

export type Permission = {
  id: PermissionID,
};

export const toPermissionId = (mixed: mixed): PermissionID => toUUID(mixed);

export const toPermission = (mixed: mixed): Permission => toObject(mixed, object => ({
  id: toPermissionId(object.id),
}));
