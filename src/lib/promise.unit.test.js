import { pFilter } from './promise';

describe('pfilter()', () => {
  it('should filter an array by a promise-resolving filter function', async () => {
    const array = [
      0,
      1,
      2,
      3
    ];

    const lessThanTwo = async (number) => (number < 2);

    const numbersLessThanTwo = await pFilter(array, lessThanTwo);

    expect(numbersLessThanTwo).toEqual([0, 1]);
  })
});
