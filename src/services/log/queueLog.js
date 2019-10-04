// @flow strict
/*::
import type { EventLogger } from '../log.2.js';
import type { Event } from '../../events';

export type QueueLogger = EventLogger & {
  isConnected: () => boolean,
  connectLogger: (logger: EventLogger) => void,
  disconnectLogger: () => void,
};
*/
/**
 * A real log service is not always available. Sometimes they
 * disconnect, or take some time to warm up, or are unavailable
 * until the configuration is parsed. However, the application will
 * continue to generate events in that time.
 * 
 * The Queue Logger accepts events as a real logger would, but stores
 * them in an internal queue until another logging service is connected.
 * 
 * Only one logging service can be connected at a time.
 */
const createQueueLogger = ()/*: QueueLogger*/ => {
  let eventQueue/*: Array<Event>*/ = [];
  let connectedLogger/*: ?EventLogger*/ = null;

  const log = (event) => {
    if (connectedLogger) {
      connectedLogger.log(event);
    } else {
      eventQueue.push(event);
    }
  };

  const connectLogger = (logger) => {
    connectedLogger = logger;
    // log every message of the queue that has been building up since
    // we haven't been connected
    for (const event of eventQueue) {
      connectedLogger.log(event);
    }
    eventQueue = [];
  };

  const disconnectLogger = () => {
    connectedLogger = null;
  };

  const isConnected = () => connectedLogger !== null;
  
  return {
    log,
    connectLogger,
    disconnectLogger,
    isConnected,
  };
};

module.exports = {
  createQueueLogger,
};
