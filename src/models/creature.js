// @flow strict
/*::
import type { UUID } from './uuid';
*/
const { toUUID } = require('./uuid');
const { toObject, toString, toNumber } = require('@lukekaalim/to');
/*::
export opaque type CreatureID: UUID = UUID;
export type Creature = {
  id: CreatureID,
  title: string,
  hitPoints: number,
};
*/

const toCreatureId = (value/*: mixed*/)/*: CreatureID*/ => toUUID(value);
const toCreature = toObject({
  id: toCreatureId,
  title: toString,
  hitPoints: toNumber,
});

module.exports = {
  toCreatureId,
};
