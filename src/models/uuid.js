// @flow strict
const uuid = require('uuid/v4');
const { toString } = require('@lukekaalim/to');

/*::
export opaque type UUID: string = string;
*/

const generateUUID = ()/*: UUID*/ => uuid();
const toUUID/*: mixed => UUID*/ = val => toString(val);

module.exports = {
  generateUUID,
  toUUID,
};