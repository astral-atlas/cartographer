// @flow
import type { ChapterID } from '../../models/atlas/chapter';
import type { ChapterEvent } from '../../models/atlas/chapter/chapterEvent';
import type { NarrateEvent, NarrateEventID } from '../../models/atlas/chapter/narrateEvent';
import type { StorageService } from '../storage';
import { buildNarrateEvent } from '../../models/atlas/chapter/narrateEvent';

export type ChapterEventService = {
  getEvents: (chapterId: ChapterID) => Promise<Array<ChapterEvent>>,
  addNarrateEvent: (chapterId: ChapterID, narration: string) => Promise<NarrateEvent>,
};

export const buildChapterEventService = (
  narrateEventStorage: StorageService<NarrateEventID, NarrateEvent>,
  narrateEventByChapterIdIndex: (chapterId: ChapterID) => Promise<Array<NarrateEvent>>,
): ChapterEventService => {
  const getEvents = async (chapterId) => [
    ...await narrateEventByChapterIdIndex(chapterId),
  ];

  const addNarrateEvent = async (chapterId, narration) => {
    const event = buildNarrateEvent(chapterId, narration);
    await narrateEventStorage.create(event.id, event);
    return event;
  };

  return {
    getEvents,
    addNarrateEvent,
  };
};
