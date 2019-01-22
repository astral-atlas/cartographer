// @flow
import type { RichTextNode } from 'stupid-rich-text';
import type { UUID } from './uuid';
import type { PermissionID } from './permission';
import { toUUID, generateUUID } from './uuid';
import { toObject, toString } from './serialization';
import { toPermissionId } from './permission';

export opaque type ChapterID: UUID = UUID;
export opaque type CharacterID: UUID = UUID;

export type DialogueEvent = {
  type: 'dialogue',
  speaker: CharacterID,
  richTextRootNode: RichTextNode,
};

export type Chapter = {
  id: ChapterID,
  name: string,
  readPermission: PermissionID,
};

export const toChapter = (value: mixed): Chapter => (
  toObject(value, object => ({
    id: toChapterId(object.id),
    name: toString(object.name),
    readPermission: toPermissionId(object.readPermission),
  }))
);

export const toEvent = (value: mixed): DialogueEvent => (
  toObject(value, event => {
    switch(event.type) {
    case 'dialogue':
      return toDialogueEvent(event);
    default:
      throw new Error('Unknown Event Type');
    }
  })
);

export const toDialogueEvent = (value: mixed): DialogueEvent => (
  toObject(value, event => ({
    type: 'dialogue',
    speaker: toCharacterID(event.speaker),
    // $FlowFixMe
    richTextRootNode: (event.richTextRootNode: any), // TODO: type
  }))
);

export const toCharacterID = (value: mixed): CharacterID => (
  toUUID(value)
);

export const toChapterId = (value: mixed): ChapterID => (
  toUUID(value)
);

export const buildNewChapter = (name: string, readPermission: PermissionID): Chapter => ({
  id: generateUUID(),
  name,
  readPermission,
});
