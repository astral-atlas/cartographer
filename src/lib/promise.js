// @flow

export const pFilter = async <T>(
  array: Array<T>,
  filter: T => Promise<boolean>,
): Promise<Array<T>> => {
  const filterResults = await Promise.all(array.map(filter));
  return array.filter((_, index) => filterResults[index]);
};
