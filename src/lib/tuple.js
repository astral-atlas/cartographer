// @flow

export const getTupleSecond = <TFirst, TSecond>(tuple: [TFirst, TSecond]): TSecond => (
  tuple[1]
);
export const getTupleFirst = <TFirst, TSecond>(tuple: [TFirst, TSecond]): TFirst => (
  tuple[0]
);