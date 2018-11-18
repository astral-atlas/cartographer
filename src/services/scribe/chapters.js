// @flow
import type { ChapterID, Chapter } from '../../lib/chapters';
import type { UserID }from '../../lib/authentication';
import type { SafeStorage } from '../storage/safeStorage';
import {
  canUserWrite,
  canUserRead,
  CantWriteAsGlobalError,
} from '../../lib/permissions';
import { GLOBAL_USER } from '../../lib/authentication';
import { buildScopedStorage } from '../storage/scopedStorage';
import { buildTypedStorage } from '../storage/typedStorage';
import { buildScope } from '../../lib/scope';
import { KeyNotFoundError } from '../storage';
import { toChapterId, toChapter } from '../../lib/chapters';
import { toArray } from '../../lib/serialization';

export type Chapters = {
  getChapterIds: (user: UserID) => Promise<Array<ChapterID>>,
  addChapter: (chapter: Chapter, user: UserID) => Promise<void>,
  getChapter: (id: ChapterID, user: UserID) => Promise<Chapter>,
};

export function CantRetrieveChapter(chapterId: string, message: string) {
  return new Error(`Cannot retrieve the chapter at ID: "${chapterId}"\n${message}`);
}

const chapterIdScope = buildScope('CHAPTER_ID');
const metaIdScope = buildScope('META');

const IDS_LIST_KEY = metaIdScope('IDS_LIST');

export const buildChapters = (safeStorage: SafeStorage<string>): Chapters => {
  const getAllIds = async (): Promise<Array<ChapterID>> => (
    toArray(JSON.parse(await safeStorage.get(IDS_LIST_KEY)), toChapterId)
  );

  const getChapterIds = async (userId: UserID) => {
    const ids = await getAllIds();
    const chapters = await Promise.all(ids.map(id => getChapter(id, userId)));
    const visableChapters = chapters.filter(chapter =>
      canUserRead(chapter.permissions, userId)
    );
    return visableChapters.map<ChapterID>(chapter => chapter.id);
  };
  const addChapter = async (chapter: Chapter, userId: UserID) => {
    const idKey = chapterIdScope(chapter.id);
    const keys = [idKey, IDS_LIST_KEY];
    if (userId === GLOBAL_USER.userId) {
      throw new CantWriteAsGlobalError();
    }
    await safeStorage.doWithSafeStorage(keys, async (storage) => {
      const ids = await getAllIds();
      const newIds = JSON.stringify([...ids, chapter.id]);
      await storage.put(IDS_LIST_KEY, newIds);
      await storage.put(chapterIdScope(idKey), JSON.stringify(chapter));
    });
  };

  const getChapter = async (id: ChapterID, userId: UserID) => {
    try {
      const chapter = toChapter(JSON.parse(await safeStorage.get(chapterIdScope(id))));
      if (!canUserRead(chapter.permissions, userId)) {
        throw new CantRetrieveChapter(
          id,
          `The user "${userId}" attempted to read `+
          `a chapter they did not have permission to read.`
        );
      }
      return chapter;
    } catch (err) {
      if (err instanceof KeyNotFoundError) {
        throw new CantRetrieveChapter(id, err.message);
      }
      throw err;
    }
  };

  return {
    getChapterIds,
    addChapter,
    getChapter,
  };
};
