// @flow
import { EOL } from 'os';

/*::
import type { LogService } from '../log.2.js';
import type { Writable } from 'stream';
*/

export const createJSONStreamLog = (stream/*:Writable*/)/*: LogService*/ => {
  const logEvent = (log) => {
    const stringToWrite = JSON.stringify(log);
    stream.write(stringToWrite + EOL);
  };
  return {
    logEvent,
  };
};