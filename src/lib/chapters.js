// @flow
import type { RichTextNode } from 'stupid-rich-text';
import type { SerializableValue } from '../types';
import type { UUID } from './uuid';
import { generateUUID, toUUID } from './uuid';
import { toString, toBoolean, toArray, toObject } from './serialization';

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
};

export const buildNewEmptyChapter = (): Chapter => ({
  id: generateUUID(),
  active: false,
  title: '',
  subjects: [],
  events: [],
});

export const toChapter = (value: SerializableValue): Chapter => (
  toObject(value, chapter => ({
    active: toBoolean(chapter.active),
    id: toChapterId(chapter.id),
    title: toString(chapter.title),
    subjects: toArray(chapter.subjects, toCharacterID),
    events: toArray(chapter.events, toEvent),
  }))
);

export const toEvent = (value: SerializableValue): DialogueEvent => (
  toObject(value, event => {
    switch(event.type) {
    case 'dialogue':
      return toDialogueEvent(event);
    default:
      throw new Error('Unknown Event Type');
    }
  })
);

export const toDialogueEvent = (value: SerializableValue): DialogueEvent => (
  toObject(value, event => ({
    type: 'dialogue',
    speaker: toCharacterID(event.speaker),
    // $FlowFixMe
    richTextRootNode: (event.richTextRootNode: any), // TODO: type
  }))
);

export const toCharacterID = (value: SerializableValue): CharacterID => (
  toUUID(value)
);

export const toChapterId = (value: SerializableValue): ChapterID => (
  toUUID(value)
);
