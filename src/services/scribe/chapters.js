// @flow
import type { ChapterID, Chapter } from '../../lib/chapters';
import type { LockableStorageService } from '../storage/lockableStorage';
import { toChapterId, toChapter } from '../../lib/chapters';
import { toArray } from '../../lib/serialization';

export type ChaptersService = {
  getActiveChapterIds: () => Promise<Array<ChapterID>>,
  addChapter: (chapter: Chapter) => Promise<void>,
  getChapter: (id: ChapterID) => Promise<Chapter>,
};

const ALL_CHAPTER_IDS = 'ALL_CHAPTER_IDS';

const loadAllChapterIds = async (storage) => (
  toArray<ChapterID>(await storage.load(ALL_CHAPTER_IDS), toChapterId)
);

function CantRetrieveChapter(chapterId, message) {
  throw new Error(`Cannot retrieve the chapter at ID: "${chapterId}"\n${message}`);
}

export const buildChapterService = (storage: LockableStorageService) => {
  const getActiveChapterIds = async () => {
    const ids = await loadAllChapterIds(storage);
    const chapters = await Promise.all(ids.map(getChapter));
    const activeChapters = chapters.filter(chapter => chapter.active);
    return activeChapters.map<ChapterID>(chapter => chapter.id);
  };
  const addChapter = async (chapter: Chapter) => {
    await storage.atomicEdit([chapter.id, ALL_CHAPTER_IDS], async (atomicStorage) => {
      const ids = await loadAllChapterIds(atomicStorage);
      const newIds = [...ids, chapter.id];
      await atomicStorage.save(ALL_CHAPTER_IDS, newIds);
      await atomicStorage.save(chapter.id, chapter);
    });
  };
  const getChapter = async (id: ChapterID) => {
    try {
      return toChapter(await storage.load(id));
    } catch (err) {
      throw new CantRetrieveChapter(id, err.message);
    }
  };

  return {
    getActiveChapterIds,
    addChapter,
    getChapter,
  };
};
