// @flow
import { EOL } from 'os';

/*::
import type { EventLogger } from '../log.2.js';
import type { Writable } from 'stream';
*/

export const createJSONStreamLog = (stream/*:Writable*/)/*: EventLogger*/ => {
  const log = (event) => {
    const stringToWrite = JSON.stringify(event);
    stream.write(stringToWrite + EOL);
  };
  return {
    log,
  };
};