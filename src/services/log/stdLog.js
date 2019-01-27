// @flow
import type { Writable } from 'stream';
import type { LogService } from '../log';

export const buildStdLog = (
  stdout?: Writable = process.stdout,
  stderr?: Writable = process.stderr,
): LogService<string> => {
  const log = (message, level = 'info') => {
    switch (level) {
    case 'info':
    case 'warn':
      return stdout.write(message);
    case 'error':
      return stderr.write(message);
    }
  };

  return {
    log,
  };
};
