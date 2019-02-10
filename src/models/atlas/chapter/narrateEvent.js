// @flow
import type { UUID } from '../../../lib/uuid';
import type { ChapterID } from '../chapter';
import { generateUUID } from '../../../lib/uuid';

export opaque type NarrateEventID: UUID = UUID;

export type NarrateEvent = {
  id: NarrateEventID,
  type: 'narrate',
  chapterId: ChapterID,
  narration: string,
};

export const buildNarrateEvent = (
  chapterId: ChapterID,
  narration: string,
): NarrateEvent => ({
  id: generateUUID(),
  type: 'narrate',
  chapterId,
  narration,
});
