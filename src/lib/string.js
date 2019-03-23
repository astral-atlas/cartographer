// @flow

export const caseInsensitiveEqualityCheck = (stringA: string, stringB: string) => (
  stringA.toLowerCase() === stringB.toLowerCase()
);

export const toLowerCase = (inputString: string) => inputString.toLowerCase();
