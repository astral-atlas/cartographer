// @flow

export type Logger<T> = {
  log: (message: T) => void,
};
