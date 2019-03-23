// @flow
import { reduceArray, toGroupsOf } from './reduce';

describe('reduceArray()', () => {
  it('should apply the reduce function to given array, returning the result', () => {
    const sum = (a, b) => a + b;
    const array = [1, 1, 2];

    expect(reduceArray(array, sum, 0)).toEqual(4);
  });
});

describe('toGroupsOf()', () => {
  it('should group array elements together, in groups determined by the argument', () => {
    const array = [1, 2, 3, 4, 5, 6];

    expect(array.reduce(toGroupsOf(2), [])).toEqual([[1, 2], [3, 4], [5, 6]]);

    expect(array.reduce(toGroupsOf(3), [])).toEqual([[1, 2, 3], [4, 5, 6]]);

    expect(array.reduce(toGroupsOf(4), [])).toEqual([[1, 2, 3, 4], [5, 6]]);

    expect(array.reduce(toGroupsOf(6), [])).toEqual([[1, 2, 3, 4, 5, 6]]);
  });
});
