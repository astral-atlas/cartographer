// @flow

export type LogLevel =
  | 'info'
  | 'warn'
  | 'error';

export type LogService<TLogType> = {
  log: (message: TLogType, level?: LogLevel) => mixed,
}
