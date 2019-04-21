// @flow
import { strictEqual } from 'assert';
import { createAtlasImperativeClient } from './atlasImperativeClient';

describe('atlasImperativeClient', () => {
  describe('getUsers', () => {
    it('should return a Result with Users as the value', async () => {
      const connection = {
        username: '',
        password: '',
        endpoint: '',
      };
      const get = (url) => url === '/user-list' ? Promise.resolve(JSON.stringify([{ id: '123', displayName: 'Jordan' }])) : Promise.reject(new Error('404'));
      const client = createAtlasImperativeClient(connection, get);

      const usersResponse = await client.getUsers();

      strictEqual(usersResponse.type, 'success');
      if (usersResponse.type === 'success') {
        strictEqual(usersResponse.value[0].id, '123');
        strictEqual(usersResponse.value[0].displayName, 'Jordan');
      }
    });
  });
});