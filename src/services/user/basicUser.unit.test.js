// @flow
import { buildBasicUserService } from './basicUser';
import { generateUser } from '../../lib/user';
import { NullStream } from '../../lib/stream';
import { TypedMap } from '../../lib/typedMap';

const generateMockIncomingRequest = (url) => ({
  headers: new TypedMap(),
  url,
  method: 'GET',
  path: '',
  queries: new TypedMap(),
  requestBody: new NullStream(),
});

describe('buildBasicUserService() instance', () => {
  it('should authenticate you as the user provided to the factory', async () => {
    const mockUser = generateUser('luke');
    const mockRequest = generateMockIncomingRequest('/path');

    const userService = buildBasicUserService(mockUser, []);

    const user = await userService.getUser(mockRequest);

    expect(user).toEqual(mockUser);
  });
});
