// @flow
import type { StorageService } from '../storage';
import type { RoleService } from '../role';
import type { PermissionService } from '../permission';

import type { Chapter, ChapterID } from '../../models/atlas/chapter';

import type { UserID } from '../../lib/user';
import type { PermissionID } from '../../lib/permission';
import type { Indexer } from '../../lib/indexer';
import { userHasPermission, addRoleWithPermissionsAndUsers } from '../role';
import { KeyNotFoundError, KeyAlreadyExists } from '../storage';
import { buildNewChapter } from '../../models/atlas/chapter';

export type ChapterService = {
  getChapter: (userId: UserID, chapterId: ChapterID) => Promise<Chapter>,
  addNewChapter: (userId: UserID, chapterName: string) => Promise<Chapter>,
  getAllChapters: (userId: UserID) => Promise<Array<Chapter>>,
  //getChapterAndEvents: (userId: UserID, chapterId: ChapterID) => Promise<{ chapter: Chapter, events: Array<ChapterEvent>}>,
  //addEvent: (userId: UserID, chapterId: ChapterID, event: Event) => Promise<void>,
};

export class InsufficientPermissionsError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ChapterNotFoundError extends Error {
  constructor(chapterId: ChapterID, cause: Error) {
    super(`Could not find chapter '${chapterId}'\n${cause.message}`);
    this.stack = cause.stack;
  }
}

const enhanceGet = (get) => async (chapterId) => {
  try {
    return await get(chapterId);
  } catch (err) {
    switch (true) {
    case err instanceof KeyNotFoundError:
      throw new ChapterNotFoundError(chapterId, err);
    default:
      throw err;
    }
  }
};

const enhanceSet = (set) => async (chapterId, chapter) => {
  try {
    return await set(chapterId, chapter);
  } catch (err) {
    switch (true) {
    case err instanceof KeyAlreadyExists:
    default:
      throw err;
    }
  }
};

export const buildChapterService = (
  chapterStorageService: StorageService<ChapterID, Chapter>,
  roleService: RoleService,
  permissionService: PermissionService,
  globalChapterAddPermissionId: PermissionID,
  getChaptersByReadPermissions: Indexer<Chapter, UserID>,
): ChapterService => {
  const getChapterFromStorage = enhanceGet(chapterStorageService.read);
  const setChapterFromStorage = enhanceSet(chapterStorageService.create);

  const getChapter = async (userId, chapterId) => {
    const chapter = await getChapterFromStorage(chapterId);
    if (!(await userHasPermission(roleService, userId, chapter.readPermission))) {
      throw new InsufficientPermissionsError('User does not have a role that can read for the chapter');
    }
    //const events = await chapterEventService.getEvents(chapterId);
    return chapter;
  };

  const getAllChapters = async (userId) => {
    return getChaptersByReadPermissions(userId);
  };

  const addNewChapter = async (userId, chapterName) => {
    if (!userHasPermission(roleService, userId, globalChapterAddPermissionId)) {
      throw new InsufficientPermissionsError('User does not have a role that can add a chapter');
    }
    const readPermission = await permissionService.addNewPermission();
    const masterPermission = await permissionService.addNewPermission();
    await addRoleWithPermissionsAndUsers(
      roleService,
      [userId],
      [readPermission.id, masterPermission.id],
    );

    const newChapter = buildNewChapter(chapterName, readPermission.id, masterPermission.id);

    await setChapterFromStorage(newChapter.id, newChapter);
    return newChapter;
  };
  return {
    getChapter,
    getAllChapters,
    addNewChapter,
  };
};
