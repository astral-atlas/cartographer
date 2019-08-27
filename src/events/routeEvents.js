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
  error: Error,
  timestamp: number,
};
*/
const errorRoute = (
  error/*: Error*/,
  timestamp/*: number*/ = Date.now(),
)/*: RouteErrorEvent*/ => ({
  type: 'route-error',
  error,
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
export type RouteEvent =
  | RouteReceiveEvent
  | RouteResponseEvent
  | RouteErrorEvent
  | RouteNotFoundEvent;
*/

module.exports = {
  errorRoute,
  createRouteNotFoundEvent,
  respondRoute,
  receiveRoute,
}