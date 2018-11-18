// @flow
import type { Logger } from '../logger';
import { EOL } from 'os';

const buildStdLoggerFactory = (pipe: 'stdout' | 'stderr') => {
  const stdoutLog = (message) => {
    process.stdout.write(message + EOL);
  };
  const stderrLog = (message) => {
    process.stdout.write(message + EOL);
  };

  return {
    log: pipe === 'stdout' ? stdoutLog : stderrLog,
  };
};

export const buildStdoutLogger = (): Logger<string> =>
  buildStdLoggerFactory('stdout');

export const buildStderrLogger = (): Logger<string> =>
  buildStdLoggerFactory('stderr');
