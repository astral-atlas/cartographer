// @flow

/**
 * Quickly construct a handy util to consistently scope a set of keys with a particular prefix.
 */
export const buildScope = (
  scopePrefix: string,
  seperator?: string = '-',
) => (key: string) => `${scopePrefix}${seperator}${key}`;
