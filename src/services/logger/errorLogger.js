// @flow
import type { Logger } from '../logger';

export const buildErrorLogger = (baseLogger: Logger<string>): Logger<Error> => {
  const log = (error) => {
    baseLogger.log(error.stack)
  };

  return {
    log,
  };
};
