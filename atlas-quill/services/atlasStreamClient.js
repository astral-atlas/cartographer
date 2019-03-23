const createEventEmitter = () => {
  let listeners = new Set();

  const emit = (event) => {
    listeners.forEach(listener => listener(event));
  };

  const removeListener = (listenerToRemove) => {
    listeners = new Set([...listeners].filter(listener => listener !== listenerToRemove));
  };

  const addListener = (listenerToAdd) => {
    listeners = new Set([...listeners, listenerToAdd]);
  };

  const getListenerCount = () => {
    return listeners.size;
  };

  return {
    emit,
    addListener,
    removeListener,
    getListenerCount,
  };
};

const pauseableInterval = (onInterval, msTillInterval, startOnInit = false) => {
  let intervalId = null;

  const start = () => {
    if (intervalId === null) {
      intervalId = setInterval(onInterval, msTillInterval);
    }
  };

  const stop = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const trigger = () => {
    onInterval();
  };

  if (startOnInit) {
    start();
  }

  return {
    start,
    stop,
    trigger,
  }
};

const sum = (acc, curr) => acc + curr;

export const createAtlasStreamClient = (atlasClient) => {
  const usersEmitter = createEventEmitter();
  const chaptersEmitters = new Map();
  const updateEndpointsInterval = pauseableInterval(onCheckUpdate, 1000, false);

  function onListenerAdd() {
    updateEndpointsInterval.start();
    updateEndpointsInterval.trigger();
  }

  function onListenerRemove() {
    const totalListeners = [
      usersEmitter.getListenerCount(),
      [...chaptersEmitters.values()]
        .map(emitter => emitter.getListenerCount())
        .reduce(sum, 0),
    ].reduce(sum, 0);

    if (totalListeners < 1) {
      updateEndpointsInterval.stop();
    }
  }
  
  async function onCheckUpdate() {
    if (usersEmitter.getListenerCount() > 0) {
      atlasClient.getUsers().then(users => usersEmitter.emit(users));
    }
    for (let [userId, emitter] of chaptersEmitters) {
      atlasClient.getChapters(userId).then(chapters => emitter.emit(chapters));
    }
  }

  const addUsersListener = (listener) => {
    usersEmitter.addListener(listener);
    onListenerAdd();
    return () => {
      usersEmitter.removeListener(listener);
      onListenerRemove();
    };
  };

  const addChaptersListener = (listener, userId) => {
    if (chaptersEmitters.has(userId)) {
      const emitter = chaptersEmitters.get(userId);
      emitter.addListener(listener);
    } else {
      const emitter = createEventEmitter();
      chaptersEmitters.set(userId, emitter);
      emitter.addListener(listener);
    }
    onListenerAdd();
    return () => {
      const emitter = chaptersEmitters.get(userId);
      emitter.removeListener(listener);
      if (emitter.getListenerCount() < 1) {
        chaptersEmitters.delete(userId);
      }
      onListenerRemove();
    };
  };

  return {
    addUsersListener,
    addChaptersListener,
  };
};
