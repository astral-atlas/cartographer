// @flow
import { AtlasScribeError } from '../errors';

export class POSTInputError extends AtlasScribeError {
  constructor(message: string) {
    super(message);
  }
}

export class URLQueryError extends AtlasScribeError {
  constructor(message: string) {
    super(message);
  }
}
