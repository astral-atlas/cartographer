import { buildApiRoutes, ok } from './apiRoute';

const generateMockApiRoute = (path, method, handler) => ({
  path,
  method,
  handler,
});

const generateMockIncomingRequest = (method, url) => ({
  url,
  method,
});

const generateMockRouteServer = (routes) => (incomingRequest) => (
  !!routes.find(route => route.test(incomingRequest))
);

describe('The apiRoute.buildApiRoutes() func', () => {
  it('should return an array of routes for each incoming requests that match the path and method', () => {
    const apiRoutes = [
      generateMockApiRoute('/path', 'GET', ok),
      generateMockApiRoute('/another-path', 'GET', ok),
      generateMockApiRoute('/post-only', 'POST', ok),
      generateMockApiRoute('/get-and-post', 'POST', ok),
      generateMockApiRoute('/get-and-post', 'GET', ok),
    ];

    const routes = buildApiRoutes(apiRoutes);
    const testServer = generateMockRouteServer(routes);


    expect(testServer(generateMockIncomingRequest('GET', '/path'))).toBe(true);
    expect(testServer(generateMockIncomingRequest('POST', '/path'))).toBe(false);
    expect(testServer(generateMockIncomingRequest('POST', '/wrong-path'))).toBe(false);

    expect(testServer(generateMockIncomingRequest('GET', '/another-path'))).toBe(true);

    expect(testServer(generateMockIncomingRequest('POST', '/post-only'))).toBe(true);
    expect(testServer(generateMockIncomingRequest('GET', '/post-only'))).toBe(false);


    expect(testServer(generateMockIncomingRequest('POST', '/get-and-post'))).toBe(true);
    expect(testServer(generateMockIncomingRequest('GET', '/get-and-post'))).toBe(true);
  });
  it('should return an options route for each unique path', () => {
    const apiRoutes = [
      generateMockApiRoute('/path', 'GET', ok),
      generateMockApiRoute('/another-path', 'GET', ok),
      generateMockApiRoute('/another-path', 'POST', ok),
    ];

    const routes = buildApiRoutes(apiRoutes);
    const testServer = generateMockRouteServer(routes);

    expect(testServer(generateMockIncomingRequest('OPTIONS', '/path'))).toBe(true);
    expect(testServer(generateMockIncomingRequest('OPTIONS', '/another-path'))).toBe(true);
  });
});

describe('The apiRoute.ok() func', () => {
  test.todo('should return with a apiRouteServerResponse of 200');
  test.todo('should return with stream of the JSON.stringify result');
});
