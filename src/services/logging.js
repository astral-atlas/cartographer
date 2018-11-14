// @flow
import type { SerializableValue } from '../types';
import { InternalServiceInitializationError, InternalServiceError, tryBuildService } from '../services';

export type StdoutConfig = {
  mode: 'stdout',
  name?: string,
};

export type HttpConfig = {
  mode: 'http',
  endpoint: string,
};

export type LoggingServiceConfig =
  | StdoutConfig
  | HttpConfig

export type LoggingService = {
  logInfo: (message: SerializableValue) => void,
  logWarn: (message: SerializableValue) => void,
  logError: (message: SerializableValue) => void,
};

export type Log = {
  type: 'info' | 'warn' | 'error',
  message: SerializableValue,
};

function UnrecognisedLogModeError(logMode: string) {
  return new InternalServiceInitializationError(
    'Logging Service',
    `"${logMode}" was not recognised as a valid logging mode in the provided config.\n(Expecting 'stdout')`
  );
}
function UndefinedLogModeError() {
  return new InternalServiceInitializationError(
    'Logging Service',
    'An undefined or null value was provided for the logging mode.\n(Expecting \'stdout\')'
  );
}
function WriteFailError(message: string, pipeName: 'stdout' | 'stderr') {
  return new InternalServiceError(
    'Logging Service',
    `An error occured while trying to write to ${pipeName}\n${message}`,
  );
}

export const buildLoggingService = (conf: LoggingServiceConfig): LoggingService => {
  const name = typeof conf.name === 'string' ? `Stdout Logging Service (${conf.name})` : 'Stdout Logging Service';
  switch (conf.mode) {
  case 'stdout':
    return tryBuildService<LoggingService>(name, () => createStdoutLoggingService());
  case undefined:
  case null:
    throw new UndefinedLogModeError();
  default:
    throw new UnrecognisedLogModeError(conf.mode);
  }
};

const createStdoutLoggingService = (): LoggingService => {
  const makeStdOutLogger = (level) => (message) => {
    const log: Log = { type: level, message };
    const serializedLog = JSON.stringify(log);
    try { process.stdout.write(serializedLog + '\n'); }
    catch (err) { WriteFailError(err.message, 'stdout'); }
  };
  const makeStdErrLogger = (level) => (message) => {
    const log: Log = { type: level, message };
    const serializedLog = JSON.stringify(log);
    try { process.stderr.write(serializedLog); }
    catch (err) { WriteFailError(err.message, 'stderr'); }
  };

  return {
    logInfo: makeStdOutLogger('info'),
    logWarn: makeStdOutLogger('warn'),
    logError: makeStdErrLogger('error'),
  };
};
