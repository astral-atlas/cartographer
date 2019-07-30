// @flow strict
/*::
import type { UUID } from './uuid';
*/
const { toUUID, generateUUID } = require('./uuid');
const { toObject, toString } = require('@lukekaalim/to');

/*::
export opaque type LocationID: UUID = UUID;

export type Location = {
  id: LocationID,
  name: string,
};
*/
const createLocation = (name/*: string*/)/*: Location*/ => ({
  id: generateUUID(),
  name,
});

const toLocationId/*: mixed => LocationID*/ = val => toUUID(val);
const toLocation/*: mixed => Location*/ = toObject({
  id: toLocationId,
  name: toString,
})

module.exports = {
  createLocation,
  toLocationId,
  toLocation,
};