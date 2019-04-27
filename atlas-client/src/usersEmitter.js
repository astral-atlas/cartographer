// @flow
import type { User } from './user';
import type { AtlasImperativeClient } from './atlasImperativeClient';
import { createEventEmitter } from './lib/eventEmitter';

export const createUsersEmitter = (client: AtlasImperativeClient, intervalMs: number = 5000) => {
  const emitter = createEventEmitter();
  let listenerCount = 0;
  let interval = null;

  const onInterval = async () => {
    const userResponse = await client.getUsers();
    if (userResponse.type === 'success') {
      emitter.emit(userResponse.value);
    }
  };

  const onEmitterAdd = () => {
    listenerCount++;
    // only trigger this on the first listener
    if (listenerCount === 1) {
      interval = setInterval(onInterval, intervalMs);
    }
  };

  const onEmitterRemove = () => {
    listenerCount--;
    if (listenerCount === 0) {
      clearInterval(interval);
      interval = null;
    }
  };

  const addUserListener = (listener: Array<User> => mixed) => {
    emitter.addListener(listener);
    onEmitterAdd();
    return () => {
      emitter.removeListener(listener);
      onEmitterRemove();
    };
  };

  return [
    addUserListener,
  ];
};