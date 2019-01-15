// @flow
import type { StorageService } from '../storage';
import type { PermissionService } from '../permission';
import type { Chapter, ChapterID } from '../../lib/chapter';
import type { UserID } from '../../lib/user';
import type { PermissionID } from '../../lib/permission';
import { KeyNotFoundError, KeyAlreadyExists } from '../storage';

export type ChapterService = {
  getChapter: (userId: UserID, chapterId: ChapterID) => Promise<Chapter>,
  addNewChapter: (userId: UserID, chapter: Chapter) => Promise<void>,
  getAllChapters: (userId: UserID) => Promise<Array<Chapter>>,
  //getChapterAndEvents: (userId: UserID, chapterId: ChapterID) => Promise<{ chapter: Chapter, events: Array<ChapterEvent>}>,
  //addEvent: (userId: UserID, chapterId: ChapterID, event: Event) => Promise<void>,
};

class InsufficientPermissionsError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class ChapterNotFoundError extends Error {
  constructor(chapterId: ChapterID, cause: Error) {
    super(`Could not find chapter '${chapterId}'\n${cause.message}`);
    this.stack = cause.stack;
  }
}

const enhanceGet = (get) => (chapterId) => {
  try {
    return get(chapterId);
  } catch (err) {
    switch (true) {
    case err instanceof KeyNotFoundError:
      throw new ChapterNotFoundError(chapterId, err);
    default:
      throw err;
    }
  }
};

const enhanceSet = (set) => (chapterId, chapter) => {
  try {
    return set(chapterId, chapter);
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
  permissionService: PermissionService,
  globalChapterAddPermissionId: PermissionID,
  getChaptersByReadPermissions: (userId: UserID) => Promise<Array<Chapter>>,
): ChapterService => {
  const getChapterFromStorage = enhanceGet(chapterStorageService.read);
  const setChapterFromStorage = enhanceSet(chapterStorageService.create);

  const getChapter = async (userId, chapterId) => {
    const chapter = await getChapterFromStorage(chapterId);
    const roles = await permissionService.getRolesForPermission(userId, chapter.readPermission);
    if (roles.length === 0) {
      throw new InsufficientPermissionsError('User does not have a role that can read for the chapter');
    }
    return chapter;
  };

  const getAllChapters = async (userId) => {
    return getChaptersByReadPermissions(userId);
  };

  const addNewChapter = async (userId, chapter) => {
    const roles = await permissionService.getRolesForPermission(userId, globalChapterAddPermissionId);
    if (roles.length === 0) {
      throw new InsufficientPermissionsError('User does not have a role that can add a chapter');
    }
    await setChapterFromStorage(chapter.id, chapter);
  };
  return {
    getChapter,
    getAllChapters,
    addNewChapter,
  };
};
