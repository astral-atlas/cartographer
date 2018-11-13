// @flow
import type { SerializableValue } from './types';
import type { ServerResponse, IncomingMessage } from 'http';

export const send = (res: ServerResponse, content: string, status: number = 200) => {
  res.statusCode = status;
  res.write(content);
  res.end();
};
export const testGetUrl = (url: string) => (inc: IncomingMessage) => inc.url === url && inc.method === 'GET';
export const testPostUrl = (url: string) => (inc: IncomingMessage) => inc.url === url && inc.method === 'POST';

export const buildSimpleHandler = (responder: () => Promise<SerializableValue>) => (inc: IncomingMessage, res: ServerResponse) => {
  responder()
    .then(response => {
      send(res, JSON.stringify(response));
    })
    .catch(error => {
      console.error(error);  // eslint-disable-line no-console
    })
    .then(() => res.end());
};
