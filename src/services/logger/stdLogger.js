// @flow
import type { Logger } from '../logger';

const buildStdLoggerFactory = (pipe: 'stdout' | 'stderr') => {
  const stdoutLog = (message) => {
    process.stdout.write(message);
  };
  const stderrLog = (message) => {
    process.stdout.write(message);
  };

  return {
    log: pipe === 'stdout' ? stdoutLog : stderrLog,
  };
};

export const buildStdoutLogger = (): Logger<string> =>
  buildStdLoggerFactory('stdout');

export const buildStderrLogger = (): Logger<string> =>
  buildStdLoggerFactory('stderr');
