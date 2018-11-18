// @flow

export type Locker = {
  unlock: (key: string, duration?: number) => Promise<
    | { result: 'failed' }
    | { result: 'unlocked', relock: () => Promise<void> }
  >,
};
