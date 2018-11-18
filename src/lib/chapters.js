// @flow
import type { RichTextNode } from 'stupid-rich-text';
import type { UUID } from './uuid';
import type { UserID } from './authentication';
import type { Permissions } from './permissions';
import { generateUUID, toUUID } from './uuid';
import { toString, toBoolean, toArray, toObject } from './serialization';
import { toPermissions } from './permissions';

export opaque type ChapterID: UUID = UUID;
export opaque type CharacterID: UUID = UUID;

export type DialogueEvent = {
  type: 'dialogue',
  speaker: CharacterID,
  richTextRootNode: RichTextNode,
};

export type Chapter = {
  active: boolean,
  id: ChapterID,
  title: string,
  subjects: Array<CharacterID>,
  events: Array<DialogueEvent>,
  permissions: Permissions,
};

export const buildNewEmptyChapter = (title: string, creator: UserID): Chapter => ({
  id: generateUUID(),
  active: true,
  title,
  subjects: [],
  events: [],
  permissions: {
    readPermissions: [creator],
    writePermissions: [creator],
  }
});

export const toChapter = (value: mixed): Chapter => (
  toObject(value, chapter => ({
    active: toBoolean(chapter.active),
    id: toChapterId(chapter.id),
    title: toString(chapter.title),
    subjects: toArray(chapter.subjects, toCharacterID),
    events: toArray(chapter.events, toEvent),
    permissions: toPermissions(chapter.permissions),
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
