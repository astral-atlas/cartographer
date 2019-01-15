// @flow

export const toObjectFromTuples = <T>(arr: Array<[string, T]>): { [string]: T } => (
  arr.reduce((acc, [name, value]) => ({ ...acc, [name]: value }), {})
);
