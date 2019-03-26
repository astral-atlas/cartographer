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

const createPauseableInterval = (onInterval, msTillInterval, startOnInit = false) => {
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

const createCustomMap = (areKeysEqual) => {
  const internalMap = new Map();

  const getInternalKey = (inputKey) => {
    return [...internalMap.keys()]
    .find(currentKey => areKeysEqual(currentKey, inputKey));
  };

  const has = (inputKey) => {
    return internalMap.has(getInternalKey(inputKey));
  };

  const get = (inputKey) => {
    return internalMap.get(getInternalKey(inputKey));
  };

  const set = (inputKey, value) => {
    if (has(inputKey)) {
      internalMap.set(getInternalKey(inputKey), value);
    }
    internalMap.set(inputKey, value);
    return value;
  };

  const keys = () => internalMap.keys();
  const values = () => internalMap.values();
  const entries = () => internalMap.entries();

  return {
    get,
    set,
    has,
    keys,
    values,
    entries,
  };
};

const sum = (acc, curr) => acc + curr;

const createEmitterMap = (getEvent) => {
  const internalMap = createCustomMap(areTuplesEqual);

  const update = async () => {
    const keyEmitterPairs = [...internalMap.entries()];
    
    return Promise.all(keyEmitterPairs.map(async ([key, emitter]) => {
      if (emitter.getListenerCount() > 0) {
        emitter.emit(await getEvent(key));
      }
    }));
  };

  const addListener = (key, listener) => {
    const emitter = findOrInsertEmitter(key, internalMap);
    emitter.addListener(listener);
    return () => {
      emitter.removeListener(listener);
    };
  };

  const getListenerCount = () => {
    return [...internalMap.values()]
      .map(emitter => emitter.getListenerCount())
      .reduce(sum, 0);
  };

  return {
    update,
    addListener,
    getListenerCount,
  };
};

export const createAtlasStreamClient = (atlasClient) => {

  const usersEmitter = createEventEmitter();

  const chapters = createEmitterMap(([userId]) =>
    atlasClient.getChapters(userId)
  );
  const chapterById = createEmitterMap(([userId, chapterId]) =>
    atlasClient.getChapterById(userId, chapterId)
  );
  const events = createEmitterMap(([userId, chapterId]) =>
    atlasClient.getChapterEvents(userId, chapterId)
  );
  
  const onCheckUpdate = () => {
    if (usersEmitter.getListenerCount() > 0) {
      atlasClient.getUsers().then(users => usersEmitter.emit(users));
    }
    chapters.update();
    chapterById.update();
    events.update();
  }

  const updateEndpointsInterval = createPauseableInterval(onCheckUpdate, 1000);

  const onListenerAdd = () => {
    updateEndpointsInterval.start();
    updateEndpointsInterval.trigger();
  }

  const onListenerRemove = () => {
    const totalListeners = [
      usersEmitter,
      chapters,
      chapterById,
      events,
    ].map(emitter => emitter.getListenerCount())
      .reduce(sum, 0);

    if (totalListeners < 1) {
      updateEndpointsInterval.stop();
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
    const removeListener = chapters.addListener([userId], listener);
    onListenerAdd();

    return () => {
      removeListener();
      onListenerRemove();
    };
  };

  const addChapterByIdListener = (listener, userId, chapterId) => {
    const removeListener = chapterById.addListener([userId, chapterId], listener);
    onListenerAdd();

    return () => {
      removeListener(listener);
      onListenerRemove();
    };
  };

  const addChapterEventsListener = (listener, userId, chapterId) => {
    const removeListener = events.addListener([userId, chapterId], listener);
    onListenerAdd();

    return () => {
      removeListener(listener);
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
