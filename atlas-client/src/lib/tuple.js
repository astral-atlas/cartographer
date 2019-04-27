// @flow

export const areTuplesEqual = <T>(tupleA: Array<T>, tupleB: Array<T>): boolean => (
  tupleA.every((tupleAEntry, index) => tupleAEntry === tupleB[index]) &&
  tupleA.length === tupleB.length
);