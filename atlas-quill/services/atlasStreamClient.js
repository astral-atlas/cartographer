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

  const getHasListeners = () => {
    return listeners.size > 0;
  };

  return {
    emit,
    addListener,
    removeListener,
    getHasListeners,
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

  if (startOnInit) {
    start();
  }

  return {
    start,
    stop,
  }
};

export const createAtlasStreamClient = (atlasClient) => {
  const usersEmitter = createEventEmitter();
  const updateEndpointsInterval = pauseableInterval(onCheckUpdate, 1000, false);

  async function onListenerAdd() {
    if (usersEmitter.getHasListeners()) {
      updateEndpointsInterval.start();
    }
  }

  async function onListenerRemove() {
    if (!usersEmitter.getHasListeners()) {
      updateEndpointsInterval.stop();
    }
  }
  
  async function onCheckUpdate() {
    if (usersEmitter.getHasListeners()) {
      usersEmitter.emit(await atlasClient.getUsers());
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

  return {
    addUsersListener,
  };
};
