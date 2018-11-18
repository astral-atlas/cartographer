// @flow
import type { Chapters } from './chapters';
import type { SafeStorage } from '../storage/safeStorage';
import { buildScopedLockableStorage } from '../storage/scopedStorage';
import { buildChapters } from './chapters';

export type Scribe = {
  chapters: Chapters,
};

export const buildScribe = (storage: SafeStorage<string>): Scribe => {
  const chapters = buildChapters(
    buildScopedLockableStorage(storage, 'CHAPTERS')
  );
  return {
    chapters,
  };
};
