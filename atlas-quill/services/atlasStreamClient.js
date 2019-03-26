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

const findOrInsertEmitter = (emitterKey, emitterMap) => {
  if (!emitterMap.has(emitterKey)) {
    const newEmitter = createEventEmitter();
    emitterMap.set(emitterKey, newEmitter);
    return newEmitter;
  }
  return emitterMap.get(emitterKey);
};

const areTuplesEqual = (tupleA, tupleB) => (
  tupleA.every((tupleAEntry, index) => tupleAEntry === tupleB[index]) &&
  tupleA.length === tupleB.length
);

const sum = (acc, curr) => acc + curr;

export const createAtlasStreamClient = (atlasClient) => {
  const usersEmitter = createEventEmitter();
  const chaptersEmitters = new Map();
  const chapterByIdEmitters = new Map();
  const chapterEventsEmitters = new Map();
  const updateEndpointsInterval = pauseableInterval(onCheckUpdate, 1000);

  function onListenerAdd() {
    updateEndpointsInterval.start();
    updateEndpointsInterval.trigger();
  }

  function onListenerRemove() {
    const totalListeners = [
      usersEmitter,
      ...chaptersEmitters.values(),
      ...chapterByIdEmitters.values(),
      ...chapterEventsEmitters.values(),
    ].map(emitter => emitter.getListenerCount())
      .reduce(sum, 0);

    if (totalListeners < 1) {
      updateEndpointsInterval.stop();
    }
  }
  
  async function onCheckUpdate() {
    if (usersEmitter.getListenerCount() > 0) {
      atlasClient.getUsers().then(users => usersEmitter.emit(users));
    }
    for (let [userId, emitter] of chaptersEmitters) {
      if (emitter.getListenerCount() > 0) {
        atlasClient
          .getChapters(userId)
          .catch(() => [])
          .then(chapters => emitter.emit(chapters));
      }
    }
    for (let [[userId, chapterId], emitter] of chapterEventsEmitters) {
      if (emitter.getListenerCount() > 0) {
        atlasClient
          .getChapterEvents(userId, chapterId)
          .catch(() => null)
          .then(chapter => emitter.emit(chapter));
      }
    }
    for (let [[userId, chapterId], emitter] of chapterByIdEmitters) {
      if (emitter.getListenerCount() > 0) {
        atlasClient
          .getChapterById(userId, chapterId)
          .catch(() => null)
          .then(chapter => emitter.emit(chapter));
      }
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
    const emitter = findOrInsertEmitter(userId, chaptersEmitters);
    
    emitter.addListener(listener);
    onListenerAdd();

    return () => {
      emitter.removeListener(listener);
      onListenerRemove();
    };
  };

  const addChapterByIdListener = (listener, userId, chapterId) => {
    const key = [userId, chapterId];
    const chapterByIdEmitterKey = [...chapterByIdEmitters.keys()]
      .find(currentKey => areTuplesEqual(currentKey, key)) || key;

    const emitter = findOrInsertEmitter(chapterByIdEmitterKey, chapterByIdEmitters);

    emitter.addListener(listener);
    onListenerAdd();

    return () => {
      emitter.removeListener(listener);
      onListenerRemove();
    };
  };

  const addChapterEventsListener = (listener, userId, chapterId) => {
    const key = [userId, chapterId];
    const chapterEventsEmitterKey = [...chapterEventsEmitters.keys()]
      .find(currentKey => areTuplesEqual(currentKey, key)) || key;

    const emitter = findOrInsertEmitter(chapterEventsEmitterKey, chapterEventsEmitters);

    emitter.addListener(listener);
    onListenerAdd();

    return () => {
      emitter.removeListener(listener);
      onListenerRemove();
    };
  };

  return {
    addUsersListener,
    addChaptersListener,
    addChapterByIdListener,
    addChapterEventsListener,
  };
};
