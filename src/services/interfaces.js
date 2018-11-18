// @flow

/*
  This file is a mockup of various elements of the api.
  It's neat how everything is composed of the primitives to build the more
  complex functionality.
*/

opaque type UserID: string = string;
opaque type ChapterID: string = string;

type User = {};
type Chapter = {};

// Primitives
// Req: node(fs)
export type Storage<T> = {
  get: (key: string) => Promise<T>,
  put: (key: string, contents: T) => Promise<void>,
};

// Req: node
export type Locker = {
  lock: (key: string) => Promise<(() => Promise<void>) | null>,
};

// Req: node(process)
export type Logging = {
  log: (message: string) => void,
};

// Composites

// Req: Storage, Locker, Logging
export type SafeStorage<T> = {
  get: (get: string) => Promise<T>,
  do: ((storage: Storage<T>) => Promise<void>) => Promise<void>
};

// Req: Storage, Logging
export type Authentication = {
  getUser: (userName: string, userToken: string) => Promise<User>,
};

// App

// Req: SafeStorage, Authentication, Logging
export type Chapters = {
  getChapter: (id: ChapterID, user: UserID) => Promise<Chapter>,
  getAllChapterIds: (user: UserID) => Promise<Array<ChapterID>>,
  addNewChapter: (chapterName: string, user: UserID) => Promise<Chapter>,
};

// Transformers

export type ScopedStorage<T> = (scope: string, storage: Storage<T>) => Storage<T>;
export type ScopedSafeStorage<T> = (scope: string, safeStorage: SafeStorage<T>) => SafeStorage<T>;
