// @flow

type RoleID = string;
type Permission = 'none' | 'read' | 'read-write';
type RolePermissionMap = {
  [roleId: RoleID]: Permission,
};

type CreationHistoricalEvent = {
  type: 'creation',
  user: UserID,
  time: number,
};

type ChapterID = string;
type UserID = string;

type Chapter = {
  id: ChapterID,
  name: string,
  history: HistoryList,
  permissions: RolePermissionMap,
};

type Storage<TKey, TValue> = {
  get: (key: TKey) => Promise<TValue>,
  set: (key: TKey, value: TValue) => Promise<void>,
};

type ChaptersService = {
  getVisableChaptersForUser
};

const buildChaptersService = () => {

};
