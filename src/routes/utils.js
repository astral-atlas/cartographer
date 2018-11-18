// @flow
import type { ServerResponse, IncomingMessage } from 'http';
import type { HTTPMethod } from '../types';
import type { ScribeRoute } from '../routes';

type ScribeRouteHandler = (inc: IncomingMessage, res: ServerResponse) => void;
type SimpleHandler = (inc: IncomingMessage, res: ServerResponse) => Promise<string>;

export const buildImperativeHandler = (simpleHandler: SimpleHandler): ScribeRouteHandler => (inc, res) => {
  simpleHandler(inc, res).then(response => {
    res.write(response);
    res.end();
  });
};

type Header = {
  headerName: string,
  headerValue: string,
};

export const buildCORSHeaders = (methods?: Array<HTTPMethod> = ['GET'], useCredentials?: boolean = false, origin?: string = '*'): Array<Header> => [
  { headerName: 'Access-Control-Allow-Origin', headerValue: origin },
  { headerName: 'Access-Control-Allow-Methods', headerValue: methods.join(' ') },
  useCredentials ? { headerName: 'Access-Control-Allow-Credentials', headerValue: 'true' } : null,
].filter(Boolean);

export const setHeaders = (
  headers: Array<{ headerName: string, headerValue: string }>,
  res: ServerResponse,
) => {
  headers.forEach(({ headerName, headerValue }) => res.setHeader(headerName, headerValue));
};

export const enhanceHandlerWithHeaders = (
  handler: SimpleHandler,
  headers: Array<Header>,
): SimpleHandler => (inc, res) => {
  setHeaders(headers, res);
  return handler(inc, res);
};

export const emptyResponse: SimpleHandler = () => Promise.resolve('');

export const buildCORSPreflightRoute = (
  name: string,
  url: string,
  methods?: Array<HTTPMethod>,
  useCredentials?: boolean,
  origin?: string,
): ScribeRoute => ({
  name,
  test: (inc) => inc.url === url && inc.method === 'OPTIONS',
  handler: buildImperativeHandler(
    enhanceHandlerWithHeaders(
      emptyResponse,
      buildCORSHeaders(
        methods,
        useCredentials,
        origin
      ),
    ),
  ),
});

export const buildBody = async (inc: IncomingMessage): Promise<string> => new Promise((resolve, reject) => {
  const collectedChunks = [];
  inc.on('data', chunk => collectedChunks.push(chunk));
  inc.on('end', () => resolve(collectedChunks.join('')));
  inc.on('error', reject);
});

export const simpleMatch = (urlPath: string, method: HTTPMethod) => (inc: IncomingMessage) => (
  (new URL(inc.url, 'http://127.0.0.1').pathname === urlPath) && inc.method === method
);
