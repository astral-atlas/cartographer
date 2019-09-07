// @flow

/*::
type RouteNotFoundEvent = {
  type: 'route-not-found',
  url: string,
  timestamp: number,
};
*/
const createRouteNotFoundEvent = (
  url/*: string*/,
  timestamp/*: number*/ = Date.now(),
)/*: RouteNotFoundEvent*/ => ({
  type: 'route-not-found',
  url,
  timestamp,
});

/*::
type RouteErrorEvent = {
  type: 'route-error',
  error: string,
  timestamp: number,
};
*/
const errorRoute = (
  error/*: Error*/,
  timestamp/*: number*/ = Date.now(),
)/*: RouteErrorEvent*/ => ({
  type: 'route-error',
  error: error.stack,
  timestamp,
});

/*::
type RouteReceiveEvent = {
  type: 'route-receive',
  url: string,
  method: string,
  timestamp: number,
}
*/
const receiveRoute = (
  url/*: string*/,
  method/*: string*/ = 'GET',
  timestamp/*: number*/ = Date.now(),
)/*: RouteReceiveEvent*/ => ({
  type: 'route-receive',
  url,
  method,
  timestamp,
});

/*::
type RouteResponseEvent = {
  type: 'route-response',
  url: string,
  method: string,
  statusCode: number,
  timestamp: number,
};
*/
const respondRoute = (
  url/*: string*/,
  method/*: string*/ = 'GET',
  statusCode/*: number*/ = 200,
  timestamp/*: number*/ = Date.now(),
)/*: RouteResponseEvent*/ => ({
  type: 'route-response',
  url,
  method,
  statusCode,
  timestamp,
});

/*::
type RouteNoOriginEvent = {
  type: 'route-no-origin',
  url: string,
  method: string,
  timestamp: number,
};
*/

const noOrigin = (
  url/*: string*/,
  method/*: string*/,
  timestamp/*: number*/ = Date.now(),
) => ({
  type: 'route-no-origin',
  url,
  method,
  timestamp,
});

/*::
type RouteUnknownOriginEvent = {
  type: 'route-unknown-origin',
  url: string,
  method: string,
  timestamp: number,
};
*/

const unknownOrigin = (
  url/*: string*/,
  method/*: string*/,
  timestamp/*: number*/ = Date.now(),
) => ({
  type: 'route-unknown-origin',
  url,
  method,
  timestamp,
});

/*::
export type RouteEvent =
  | RouteReceiveEvent
  | RouteResponseEvent
  | RouteErrorEvent
  | RouteUnknownOriginEvent
  | RouteNoOriginEvent
  | RouteNotFoundEvent;
*/

module.exports = {
  errorRoute,
  createRouteNotFoundEvent,
  respondRoute,
  receiveRoute,
  noOrigin,
  unknownOrigin,
}