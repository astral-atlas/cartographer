// @flow strict
const { toObject, toNumber } = require('@lukekaalim/to');
/*::
export type DiceAmount = {
  count: number,
  size: number,
};
*/

const toDiceAmount = toObject({
  count: toNumber,
  size: toNumber,
});

module.exports = {
  toDiceAmount,
};
