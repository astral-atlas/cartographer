// @flow
type UserID = string;
type PermissionID = string;

type PResult<TValue, TError> = Promise<
  | { error: TError, value: null }
  | { error: null, value: TValue }
>;

type Storage<TKey, TValue> = {
  get: (key: TKey) => Promise<TValue>,
  set: (key: TKey, value: TValue) => Promise<void>,
}

type ChapterID = string;
type Chapter = {
  id: ChapterID,
  readPermission: PermissionID,
};

type PermissionService = {
  userHasPermission: (userId: UserID, permissionId: PermissionID) => Promise<boolean>,
};

export type ChapterService = {
  getChapter: (userId: UserID, chapterId: ChapterID) => Promise<Chapter>,
};

class InsufficientPermissionsError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class KeyNotFoundError extends Error {
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


export const buildChapterService = (
  permissionService: PermissionService,
  chapterStorage: Storage<ChapterID, Chapter>,
): ChapterService => {
  const getChapterFromStorage = enhanceGet(chapterStorage.get);

  const getChapter = async (userId, chapterId) => {
    const chapter = await getChapterFromStorage(chapterId);
    const canUserRead = await permissionService.userHasPermission(userId, chapter.readPermission);
    if (!canUserRead) {
      throw new InsufficientPermissionsError('User does not have read permissions for the chapter');
    }
    return chapter;
  };
  return {
    getChapter,
  };
};
