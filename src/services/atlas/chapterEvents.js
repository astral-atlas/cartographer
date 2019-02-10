// @flow
import type { StorageService } from '../storage';
import type { ChapterService } from './chapters';
import type { RoleService } from '../role';
import type { PermissionService } from '../permission';

import type { ChapterID } from '../../models/atlas/chapter';
import type { UserID } from '../../lib/user';
import type { PermissionID } from '../../lib/permission';

import type { ChapterEvent } from '../../models/atlas/chapter/chapterEvent';
import type { NarrateEvent, NarrateEventID } from '../../models/atlas/chapter/narrateEvent';

import { buildNarrateEvent } from '../../models/atlas/chapter/narrateEvent';
import { InsufficientPermissionsError } from './chapters';
import { userHasPermission } from '../role';

export type ChapterEventService = {
  getEvents: (userId: UserID, chapterId: ChapterID) => Promise<Array<ChapterEvent>>,
  addNarrateEvent: (userId: UserID, chapterId: ChapterID, narration: string) => Promise<NarrateEvent>,
};

export const buildChapterEventService = (
  chapterService: ChapterService,
  roleService: RoleService,
  narrateEventStorage: StorageService<NarrateEventID, NarrateEvent>,
  narrateEventByChapterIdIndex: (chapterId: ChapterID) => Promise<Array<NarrateEvent>>,
): ChapterEventService => {
  const getEvents = async (userId, chapterId) => {
    // TODO: How to test for permission without just trying to grab it?
    await chapterService.getChapter(userId, chapterId);
    return [
      ...await narrateEventByChapterIdIndex(chapterId),
    ];
  };

  const addNarrateEvent = async (userId, chapterId, narration) => {
    const chapter = await chapterService.getChapter(userId, chapterId);
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
