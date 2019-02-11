// @flow
import type { StorageService } from '../storage';
import type { RoleService } from '../role'; 

import type { ChapterID, Chapter } from '../../models/atlas/chapter';
import type { UserID } from '../../lib/user';

import type { ChapterEvent } from '../../models/atlas/chapter/chapterEvent';
import type { NarrateEvent, NarrateEventID } from '../../models/atlas/chapter/narrateEvent';

import { buildNarrateEvent } from '../../models/atlas/chapter/narrateEvent';
import { InsufficientPermissionsError, enhanceChapterStorage } from './chapters';
import { userHasPermission } from '../role';

export type ChapterEventService = {
  getEvents: (userId: UserID, chapterId: ChapterID) => Promise<Array<ChapterEvent>>,
  addNarrateEvent: (userId: UserID, chapterId: ChapterID, narration: string) => Promise<NarrateEvent>,
};

export const buildChapterEventService = (
  chapterStorageService: StorageService<ChapterID, Chapter>,
  roleService: RoleService,
  narrateEventStorage: StorageService<NarrateEventID, NarrateEvent>,
  narrateEventByChapterIdIndex: (chapterId: ChapterID) => Promise<Array<NarrateEvent>>,
): ChapterEventService => {
  const { getStoredChapter } = enhanceChapterStorage(chapterStorageService);

  const getEvents = async (userId, chapterId) => {
    const chapter = await getStoredChapter(chapterId);
    if (!userHasPermission(roleService, userId, chapter.readPermission)) {
      throw new InsufficientPermissionsError('User does not have read permissions on chapter');
    }
    return [
      ...await narrateEventByChapterIdIndex(chapterId),
    ];
  };

  const addNarrateEvent = async (userId, chapterId, narration) => {
    const chapter = await getStoredChapter(chapterId);
    if (!userHasPermission(roleService, userId, chapter.masterPermission)) {
      throw new InsufficientPermissionsError('User does not have Master permissions on chapter');
    }

    const event = buildNarrateEvent(chapterId, narration);
    await narrateEventStorage.create(event.id, event);
    return event;
  };

  return {
    getEvents,
    addNarrateEvent,
  };
};
