// @flow
/*::
const { Readable } = require('stream');
*/

/**
 * Helper function for reading streams into a string
 */
const readStream = (stream/*: Readable*/)/*: Promise<string>*/ => new Promise((resolve, reject) => {
  const collectedChunks/*: Array<string>*/ = [];
  stream.setEncoding('utf8'); // (-_-) dunno bout this chief
  stream.on('data', (chunk) => collectedChunks.push(chunk));
  stream.on('end', () => resolve(collectedChunks.join('')));
  stream.on('error', reject);
});

module.exports = {
  readStream,
};