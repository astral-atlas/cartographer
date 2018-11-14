// @flow
import type { ServerResponse, IncomingMessage } from 'http';
import type { Readable } from 'stream';
import type { SerializableValue } from './types';
import type { ScribeRoute } from './routes';

export const send = (res: ServerResponse, content: string, status: number = 200) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = status;
  res.write(content);
  res.end();
};
const testUrl = (url: string, inc: IncomingMessage) => url === inc.url;
const testMethod = (method: string, inc: IncomingMessage) => inc.method === method;

export const testGetUrl = (url: string) => (inc: IncomingMessage) => testUrl(url, inc) && testMethod('GET', inc);
export const testPostUrl = (url: string) => (inc: IncomingMessage) => testUrl(url, inc) && testMethod('POST', inc);

const drainReadableStream = async (readableStream: Readable): Promise<string> => new Promise((resolve, reject) => {
  const collectedChunks = [];
  readableStream.on('data', chunk => collectedChunks.push(chunk));
  readableStream.on('end', () => resolve(collectedChunks.join('')));
  readableStream.on('error', reject);
});

export const buildHandler = (responder: (body: string) => Promise<SerializableValue>) => (inc: IncomingMessage, res: ServerResponse) => {
  drainReadableStream(inc)
    .then(incomingBody => responder(incomingBody))
    .then(response => {
      send(res, JSON.stringify(response));
    })
    .catch(error => {
      send(res, error.message); // TODO: Disable for security reasons later
      console.error(error);  // eslint-disable-line no-console
    })
    .then(() => res.end());
};

export const enhanceRoute = (route: ScribeRoute): Array<ScribeRoute> => [
  route,
  {
    ...route,
    test: (inc) => testMethod('OPTIONS', inc),
    handler: (inc, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
      res.statusCode = 200;
      res.end();
    },
  }
];
