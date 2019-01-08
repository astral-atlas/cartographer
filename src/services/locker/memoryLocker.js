// @flow
import type { Locker } from '../locker';
import { InternalServiceError } from '../../services';

/**
 * Simple in-memory locking system
 */

function AlreadyClosedError(key) {
  return new InternalServiceError(
    'Memory Lock',
    `The lock: "${key}" was already locked when we tried to lock it. `+
    'Nothing broke, but this indicates a bad state, so we threw an error.'
  );
}

type UnlockInfo = {
  unlockExpiresAt: number,
};

export const buildMemoryLocker = (): Locker => {
  const unlockedKeys: Map<string, UnlockInfo> = new Map();

  const closeLock = async (key) => {
    if (!unlockedKeys.has(key)) {
      throw new AlreadyClosedError(key);
    } else {
      unlockedKeys.delete(key);
    }
  };
  const unlock = async (key, duration = 200) => {
    const lockInfo = unlockedKeys.get(key);
    if (lockInfo && lockInfo.unlockExpiresAt >= Date.now() ) {
      return { result: 'failed' };
    } else {
      unlockedKeys.set(key, { unlockExpiresAt: Date.now() + duration });
      return { result: 'unlocked', relock: () => closeLock(key) };
    }
  };

  return {
    unlock,
  };
};
