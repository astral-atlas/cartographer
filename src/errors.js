// @flow strict

/**
 * This Error is defined as a type so we can catch for sure when we
 * know it to be an internal, known error that was thrown and hopefully
 * handled.
 */
export class AtlasScribeError extends Error {
  constructor(message: string) {
    super(message);
  }
}
