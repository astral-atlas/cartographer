// @flow
import { strictEqual, AssertionError } from 'assert';
import { toUser } from './user';

describe('toUser', () => {
  it('should return a object that conforms to the user interface', () => {
    const input = {
      id: '123',
      displayName: 'luke',
    };
    const userResponse = toUser(input);
    if (userResponse.type !== 'success') {
      throw new AssertionError();
    }
    strictEqual(userResponse.value.displayName, input.displayName);
    strictEqual(userResponse.value.id, input.id);
  });
});
