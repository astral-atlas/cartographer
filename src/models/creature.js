// @flow strict
/*::
import type { UUID } from './uuid';
*/
const { toUUID } = require('./uuid');
/*::
export opaque type CreatureID: UUID = UUID;
export type Creature = {
  id: CreatureID,
  title: string,
  hitPoints: number,
};
*/

const toCreatureId = (value/*: mixed*/)/*: CreatureID*/ => toUUID(value);

module.exports = {
  toCreatureId,
};
