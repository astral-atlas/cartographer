// @flow

type Group<T> = Array<Array<T>>;

export type Reducer<T, Y> = (accumulator: Y, current: T, index: number) => Y;

export const reduceArray = <T, Y>(array: Array<T>, reducer: Reducer<T, Y>, initial: Y): Y => (
  array.reduce((acc, cur, index) => reducer(acc, cur, index), initial)
);

export const toGroupsOf = (
  groupCount: number
) => <T>(
  groupsSoFar: Group<T>,
  currentItem: T,
  index: number
): Group<T> => {
  const indexInGroup = index % groupCount;
  const currentGroupIndex = (index / groupCount) - indexInGroup;

  const currentGroup = groupsSoFar[currentGroupIndex] || [];
  
  const groupsSoFarWithoutCurrent = groupsSoFar.slice(0, currentGroupIndex - 1);

  const newCurrentGroup = [...currentGroup];
  newCurrentGroup[indexInGroup] = currentItem;

  return [...groupsSoFarWithoutCurrent, newCurrentGroup];
};
