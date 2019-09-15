// @flow strict
/*::
import type { UUID } from './uuid';
*/
const { toUUID, generateUUID } = require('./uuid');
const { toObject, toAString } = require('@lukekaalim/to');

/*::
export opaque type UserID: UUID = UUID;

export type User = {
  id: UserID,
};
*/
const createUser = ()/*: User*/ => ({
  id: generateUUID(),
});

const toUserID/*: mixed => UserID*/ = val => toUUID(val);
const toUser/*: mixed => User*/ = toObject({
  id: toUserID,
})

module.exports = {
  createUser,
  toUserID,
  toUser,
};