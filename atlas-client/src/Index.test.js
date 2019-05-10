const { test, equals, ok } = require('tap') ;
const { createClient, createConnection, createBasicAuthentication } = require('./Index.bs.js');

const auth = createBasicAuthentication('Dave', '12345dave');
const conn = createConnection(auth, 'localhost:8080');
const clnt = createClient(() => Promise.resolve(JSON.stringify([])), conn, value => value);

ok(true);