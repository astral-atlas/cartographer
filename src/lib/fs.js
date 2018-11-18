// @flow strict
import { writeFile, readFile } from 'fs';

export const writeToFile = (
  path: string,
  contents: string,
): Promise<void> => new Promise((resolve, reject) => {
  writeFile(path, contents, err => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});

export const readFromFile = (
  path: string,
): Promise<string> => new Promise((resolve, reject) => {
  readFile(path, (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(data.toString());
  });
});
