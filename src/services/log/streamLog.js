// @flow
const { EOL } = require('os');

/*::
import type { EventLogger } from '../log.2.js';
import type { Writable } from 'stream';
*/

const createJSONStreamLog = (stream/*:Writable*/)/*: EventLogger*/ => {
  const log = (event) => {
    const stringToWrite = JSON.stringify(event);
    stream.write(stringToWrite + EOL);
  };
  return {
    log,
  };
};

module.exports = {
  createJSONStreamLog,
};