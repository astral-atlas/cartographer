const { test, equals, ok } = require('tap') ;
const { createClient, createConnection, createBasicAuthentication } = require('./Client.bs');

const createUser = (id, displayName) => ({
  id,
  displayName,
});

const mockGet = async (url, headers) => {
  if (url !== 'www.google.com/users') {
    throw new Error('404 Not Found');
  }
  return JSON.stringify([
    createUser('123', 'dave'),
    createUser('456', 'billy'),
  ]);
};

test('getUsers()', async () => {
  const client = createClient(
    mockGet,
    createConnection(createBasicAuthentication('user', 'pass'), 'www.google.com'),
    value => Buffer.from('value', 'utf8').toString('base64')
  );
  const users = await client.getUsers();

  equals(users.length, 2);
  equals(users[0].id, '123');
  equals(users[0].displayName, 'dave');
});
