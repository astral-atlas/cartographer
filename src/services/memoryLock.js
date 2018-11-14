// @flow

/**
 * This locking system is only consistent across a single instance of node.
 * It also does not preserve the order of lock requests, and relies heavily on
 * side effects.
 */
export type MemoryLockService = {
  openLock: (key: string) => null | () => true,
  closeLock: (key: string) => true,
};

export const buildMemoryLock = (): MemoryLockService => {
  const lockSet = new Set<string>();

  const openLock = key => {
    if (lockSet.has(key)) {
      return null;
    } else {
      console.log(`Opened Lock for ${key}`);
      lockSet.add(key);
      return () => closeLock(key);
    }
  };
  const closeLock = key => {
    if (!lockSet.has(key)) {
      throw new Error('Lock is already closed');
    } else {
      console.log(`Closed Lock for ${key}`);
      lockSet.delete(key);
      return true;
    }
  };

  return {
    openLock,
    closeLock
  };
};
