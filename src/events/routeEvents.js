// @flow

/*::
type RouteNotFoundEvent = {
  type: 'route-not-found',
  url: string,
  timestamp: number,
};
*/
export const createRouteNotFoundEvent = (
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
  errorMessage: string,
  errorStack: string,
  timestamp: number,
};
*/
export const createRouteErrorEvent = (
  errorMessage/*: string*/,
  errorStack/*: string*/,
  timestamp/*: number*/ = Date.now(),
)/*: RouteErrorEvent*/ => ({
  type: 'route-error',
  errorMessage,
  errorStack,
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
export const createRouteResponseEvent = (
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
  | RouteResponseEvent
  | RouteErrorEvent
  | RouteNotFoundEvent;
*/