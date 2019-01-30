import { buildBasicUserService } from './basicUser';

const generateMockUser = (id, name) => ({
  id,
  name,
});

const generateMockIncomingRequest = (url) => ({
  headers: [],
  url,
  method: 'GET',
});

describe('buildBasicUserService() instance', () => {
  it('should authenticate you as the user provided to the factory', async () => {
    const mockUser = generateMockUser(1234, 'luke');
    const mockRequest = generateMockIncomingRequest('/path');

    const userService = buildBasicUserService(mockUser);

    const user = await userService.getUser(mockRequest);

    expect(user).toEqual(mockUser);
  });
});
