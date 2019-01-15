// @flow
import type { ServerResponse } from 'http';
import { AtlasScribeError } from '../errors';

/**
 * A generic error for a route. These routes are inherently uninfomrmative,
 * and are used to send a message back to the client. They should not expose any
 * private or important information, only generic top level description of what
 * happened
 */
export class RouteError extends AtlasScribeError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * A generic error to describe when a resource is not found
 */
export class NotFoundError extends RouteError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * A generic error to indicate that the provided method is not
 * applicable for this resource
 */
export class MethodNotAllowedError extends RouteError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * A generic error to indicate that the attempt to perform an action on
 * a unauthorized resource was denied
 */
export class NotAuthorizedError extends RouteError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * A generic error to describe when the server has broken for some reason.
 */
export class InternalServerError extends RouteError {
  constructor(message: string) {
    super(message);
  }
}

const endStreamWithStatus = (res, status, message) => {
  res.statusCode = status;
  res.write(message);
  res.end();
};

export const errorResponse = (res: ServerResponse, error: Error) => {
  switch (true) {
  case error instanceof NotFoundError:
    return endStreamWithStatus(res, 404, error.message);
  case error instanceof NotAuthorizedError:
    return endStreamWithStatus(res, 401, error.message);
  case error instanceof MethodNotAllowedError:
    return endStreamWithStatus(res, 405, error.message);
  case error instanceof InternalServerError:
    return endStreamWithStatus(res, 500, error.message);
  default:
    return endStreamWithStatus(res, 500, 'An unknown error occured');
  }
};
