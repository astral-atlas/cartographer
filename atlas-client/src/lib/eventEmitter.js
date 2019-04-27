// @flow

type EventEmitter<TEvent> = {
  emit: (event: TEvent) => void;
  addListener: (listener: (event: TEvent) => mixed) => void,
  removeListener: (listener: (event: TEvent) => mixed) => void,
  getListenerCount: () => number,
};

export const createEventEmitter = <TEvent>(): EventEmitter<TEvent> => {
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