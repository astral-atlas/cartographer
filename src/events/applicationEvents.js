// @flow strict

/*::
type ApplicationLoadConfigEvent = {
  type: 'load-config',
  timestamp: number,
};
*/
const loadedConfig = (
  configName/*: string*/,
  timestamp/*: number*/ = Date.now(),
)/*: ApplicationLoadConfigEvent*/ => ({
  type: 'load-config',
  configName,
  timestamp,
});

/*::
type ApplicationStartupEvent = {
  type: 'startup',
  timestamp: number,
};
*/
const appStartedUp = (
  timestamp/*: number*/ = Date.now(),
)/*: ApplicationStartupEvent*/  => ({
  type: 'startup',
  timestamp,
});

/*::
type ApplicationPortBindEvent = {
  type: 'port-bind',
  port: number,
  timestamp: number,
};
*/
const boundPort = (
  port/*:number*/,
  timestamp/*: number*/ = Date.now(),
)/*: ApplicationPortBindEvent*/  => ({
  type: 'port-bind',
  port,
  timestamp,
});

/*::
type ApplicationShutdownEvent = {
  type: 'shutdown',
  reason: string,
  timestamp: number,
};
*/
const appShutdown = (reason/*: string*/, timestamp/*: number*/ = Date.now())/*: ApplicationShutdownEvent*/ => ({
  type: 'shutdown',
  reason,
  timestamp,
});
/*::
export type ApplicationEvent = 
  | ApplicationLoadConfigEvent
  | ApplicationShutdownEvent
  | ApplicationPortBindEvent
  | ApplicationStartupEvent;
*/

module.exports = {
  loadedConfig,
  boundPort,
  appShutdown,
  appStartedUp,
};