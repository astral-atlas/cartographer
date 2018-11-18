// @flow
import type { ServerResponse } from 'http';
import { AtlasScribeError } from '../errors';

/**
 * A generic error for a route. These routes are inherently uninfomrmative,
 * and are used to send a message back to the client. They should not expose any
 * private or important information, only generic top level description of what
 * happened
 */
export function RouteError(message: string) {
  return new AtlasScribeError(message);
}

/**
 * A generic error to describe when a resource is not found
 */
export function NotFoundError(message: string) {
  return new RouteError(message);
}

/**
 * A generic error to indicate that the provided method is not
 * applicable for this resource
 */
export function MethodNotAllowedError(message: string) {
  return new RouteError(message);
}

/**
 * A generic error to indicate that the attempt to perform an action on
 * a unauthorized resource was denied
 */
export function NotAuthorizedError(message: string) {
  return new RouteError(message);
}

/**
 * A generic error to describe when the server has broken for some reason.
 */
export function InternalServerError(message: string) {
  return new RouteError(message);
}

export const handleRouteErrorResponse = (res: ServerResponse, error: mixed) => {
  if (error instanceof NotFoundError) {
    res.statusCode = 404;
    res.write(error.message);
    res.end();
  } else if (error instanceof NotAuthorizedError) {
    res.statusCode = 401;
    res.write(error.message);
    res.end();
  } else if (error instanceof MethodNotAllowedError) {
    res.statusCode = 405;
    res.write(error.message);
    res.end();
  } else if (error instanceof InternalServerError) {
    res.statusCode = 500;
    res.write(error.message);
    res.end();
  } else {
    res.statusCode = 500;
    res.write('An unknown error occured');
    res.end();
  }
};
