// @flow
import type { ChapterID, Chapter } from '../../lib/chapters';
import type { LockableStorageService } from '../storage';
import { InternalServiceError } from '../index';
import { toChapterId } from '../../lib/chapters';
import { toArray } from '../../lib/serialization';

export type ChaptersService = {
  getActiveChapterIds: () => Promise<Array<ChapterID>>,
  addActiveChapter: (chapter: Chapter) => Promise<void>,
};

const ACTIVE_CHAPTER_IDS = 'ACTIVE_CHAPTER_IDS';

const loadActiveChapterIds = async (storage) => (
  toArray<ChapterID>(await storage.load(ACTIVE_CHAPTER_IDS), toChapterId)
);

export const buildChapterService = (storage: LockableStorageService) => {
  const getActiveChapterIds = async () => {
    return loadActiveChapterIds(storage);
  };
  const addActiveChapter = async (chapter: Chapter) => {
    await storage.atomicEdit([ACTIVE_CHAPTER_IDS], async (atomicStorage) => {
      const ids = await loadActiveChapterIds(atomicStorage);
      const newIds = [...ids, chapter.id];
      atomicStorage.save(ACTIVE_CHAPTER_IDS, newIds);
    });
  };

  return {
    getActiveChapterIds,
    addActiveChapter,
  };
};
