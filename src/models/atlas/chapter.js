// @flow
import type { UUID } from '../../lib/uuid';
import type { PermissionID } from '../../lib/permission';
import { toUUID, generateUUID } from '../../lib/uuid';
import { toObject, toString } from '../../lib/serialization';
import { toPermissionId } from '../../lib/permission';

export opaque type ChapterID: UUID = UUID;
export opaque type CharacterID: UUID = UUID;

export type Chapter = {
  id: ChapterID,
  name: string,
  readPermission: PermissionID,
  masterPermission: PermissionID,
};

export const toChapter = (value: mixed): Chapter => (
  toObject(value, object => ({
    id: toChapterId(object.id),
    name: toString(object.name),
    readPermission: toPermissionId(object.readPermission),
    masterPermission: toPermissionId(object.masterPermission),
  }))
);

export const toChapterId = (value: mixed): ChapterID => (
  toUUID(value)
);

export const buildNewChapter = (
  name: string,
  readPermission: PermissionID,
  masterPermission: PermissionID,
): Chapter => ({
  id: generateUUID(),
  name,
  readPermission,
  masterPermission,
});
