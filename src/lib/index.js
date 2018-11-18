// @flow
import { AtlasScribeError } from '../errors';

/**
 * Throw this error to indicate that the error was casued by a library
 */
export function InternalLibraryError(
  libraryName: string,
  message: string,
) {
  return new AtlasScribeError(
    `The "${libraryName}" library threw an error\n${message}`
  );
}
