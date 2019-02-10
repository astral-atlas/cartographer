// @flow
import type { Writable } from 'stream';
import type { LogService } from '../log';

import { EOL } from 'os';

export const buildStdLog = (
  stdout?: Writable = process.stdout,
  stderr?: Writable = process.stderr,
): LogService<string> => {
  const log = (message, level = 'info') => {
    switch (level) {
    case 'info':
    case 'warn':
      return stdout.write(message + EOL);
    case 'error':
      return stderr.write(message + EOL);
    }
  };

  return {
    log,
  };
};
