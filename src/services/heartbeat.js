// @flow strict
/*::
import type { EventLogger } from './log.2';
*/
const { heartbeat } = require('../events/heartbeatEvents');

const createHeartbeat = (logger/*: EventLogger*/, beatLength/*: number*/ = 1000) => {
  const onBeat = () => {
    logger.log(heartbeat(process.memoryUsage()));
  };

  const intervalId = setInterval(onBeat, beatLength);

  const stop = () => {
    clearInterval(intervalId);
  };

  return {
    stop,
  };
}

module.exports = {
  createHeartbeat,
};