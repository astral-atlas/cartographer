// @flow
export const toTuples = /*:: <T>*/(list/*: Array<T>*/)/*: Array<[T, T]>*/ => {
  const tuples = [];
  for (let i = 0; i < list.length / 2; i ++) {
    tuples.push([list[i*2], list[(i*2) + 1]]);
  }
  return tuples;
};

export const toObjectFromTuples = /*:: <T>*/(
  tuples/*: Array<[string, T]>*/
)/*: { [string]: T }*/ => tuples.reduce((acc, [name, val]) => ({
  ...acc,
  [name]: val,
}), {});
