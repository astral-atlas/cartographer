// @flow
import { Readable } from 'stream';

/**
 * Helper function for reading streams into a string
 */
export const readStream = (stream: Readable): Promise<string> => new Promise((resolve, reject) => {
  const collectedChunks = [];
  stream.setEncoding('utf8'); // (-_-) dunno bout this chief
  stream.on('data', chunk => collectedChunks.push(chunk));
  stream.on('end', () => resolve(collectedChunks.join('')));
  stream.on('error', reject);
});

export class StringStream extends Readable {
  sourceBuffer: Buffer;

  constructor(source: string) {
    super();
    this.sourceBuffer = Buffer.from(source);
  }

  _read() {
    // TODO: need to check the push result before pushing again
    this.push(this.sourceBuffer);
    this.push(null);
  }

  getLength() {
    return this.sourceBuffer.byteLength;
  }
}
