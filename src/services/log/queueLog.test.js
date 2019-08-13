// @flow
const { performance } = require('perf_hooks')
const { expect: normalExpect, expectAll, assert } = require('@lukekaalim/test');

const { createQueueLogger } = require('./queueLog');
const { appStartedUp, boundPort, appShutdown } = require('../../events/applicationEvents');

const millisecondToMicrosecond = milliseconds => milliseconds * 1000;

const timedExpect = (testFunc) => {
  const test = async () => {
    const start = performance.now();
    const assertion = await normalExpect(testFunc).test();
    const end = performance.now();
    const durationMicroseconds = millisecondToMicrosecond(end - start);
    return {
      ...assertion,
      description: `${assertion.description} (${Math.round(durationMicroseconds)} μs)`,
    };
  };
  return { test };
};
const expect = timedExpect;

const createMockLogger = () => {
  const loggedEvents = [];
  const log = event => void loggedEvents.push(event);
  return { log, loggedEvents };
};

const expectForwardsToLogger = expect(() => {
  const queueLog = createQueueLogger();
  const mockLog = createMockLogger();
  const testEvent = appStartedUp();

  queueLog.connectLogger(mockLog);
  queueLog.log(testEvent);

  return assert(
    'When connected, event should be passed to connected logger immediately',
    mockLog.loggedEvents[0].type === testEvent.type
  );
});

const expectToBufferLogs = expect(() => {
  const queueLog = createQueueLogger();
  const mockLog = createMockLogger();
  const testEvents = [appStartedUp(), boundPort(100), appShutdown()];

  for (const event of testEvents) {
    queueLog.log(event);
  }
  queueLog.connectLogger(mockLog);

  return assert(
    'When not connected, every event logged should be passed to the logger once connected later',
    testEvents.every(testEvent => mockLog.loggedEvents.find(loggedEvent => loggedEvent.type === testEvent.type))
  )
});

const queueLogExpectations = expectAll('Queue Logger', [
  expectForwardsToLogger,
  expectToBufferLogs,
]);

module.exports = {
  queueLogExpectations,
};