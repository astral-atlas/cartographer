// @flow
import type { Locker } from '../locker';

export type MassLocker = Locker & {
  massUnlock: (keys: Array<string>, duration?: number) => Promise<
    | { result: 'failed' }
    | { result: 'unlocked', relock: () => Promise<void> }
  >,
};

export const buildMassLocker = (baseLocker: Locker): MassLocker => {
  const massUnlock = async (keys, duration) => {
    const lockInfos = await Promise.all(keys.map(key =>
      baseLocker.unlock(key, duration)
    ));
    const relock = async () => {
      await Promise.all(lockInfos.map(info =>
        info.result === 'unlocked' && info.relock()
      ));
    }
    if (lockInfos.find(info => info.result === 'failed')) {
      relock();
      return { result: 'failed' };
    }
    return { result: 'unlocked', relock };
  };

  return {
    ...baseLocker,
    massUnlock,
  };
};
