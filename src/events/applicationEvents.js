// @flow

/*::
type ApplicationLoadConfigEvent = {
  type: 'load-config',
  timestamp: number,
};
*/
export const createApplicationLoadConfigEvent = (
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
export const createApplicationStartupEvent = (
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
export const createApplicationPortBindEvent = (
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
  timestamp: number,
};
*/
export const createApplicationShutdownEvent = (timestamp/*: number*/ = Date.now())/*: ApplicationShutdownEvent*/ => ({
  type: 'shutdown',
  timestamp,
});
/*::
export type ApplicationEvent = 
  | ApplicationLoadConfigEvent
  | ApplicationShutdownEvent
  | ApplicationPortBindEvent
  | ApplicationStartupEvent;
*/
