// @flow
import { strictEqual } from 'assert';
import { toString, succeed } from './serialization';

describe('toString', () => {
  it('should return an identity string if the input is a string', () => {
    strictEqual(toString(succeed)('mog').value, 'mog');
  });
});