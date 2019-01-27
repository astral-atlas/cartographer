// @flow

export const caseInsensitiveEqualityCheck = (stringA: string, stringB: string) => (
  stringA.toLowerCase() === stringB.toLowerCase()
);
