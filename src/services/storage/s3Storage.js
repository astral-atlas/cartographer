// @flow
import type { MemoryStorageService } from './memoryStorage';
import AWS from 'aws-sdk';
import { Readable } from 'stream';
import { toArray, toString } from '../../lib/serialization';
import { createPersistantMemoryStorage } from './persistantStorage';

type S3Object = {
  ContentLength: number,
  ContentType: string,
  ETag: string,
  LastModified: string,
  Body: Buffer,
};

type S3Client = {
  getObject: (
    params: { Bucket: string, Key: string },
    callback: (error: ?Error, data: S3Object) => mixed,
  ) => void,
  putObject: (
    params: { Bucket: string, Key: string, Body: Readable | string },
    callback: (error: ?Error) => mixed,
  ) => void,
};

export const createS3Storage = function <TKey: string, TValue>(
  bucketName: string,
  bucketKey: string,
  s3Client?: S3Client = new AWS.S3(),
  serializer?: (key: TKey, value: TValue) => string = (key, value) => JSON.stringify([key, value]),
  deserializer?: (serializedValue: string) => [TKey, TValue] = (serializedValue) => JSON.parse(serializedValue),
): Promise<MemoryStorageService<TKey, TValue>> {
  const onLoad = () => new Promise(resolvePromise => {
    const onS3ObjectGet = (error, object) => {
      if (error) {
        resolvePromise(new Map([]));
        return;
      }
      const body = object.Body.toString();
      const objectContents = toArray(JSON.parse(body), element => deserializer(toString(element)));
      const s3Map = new Map(objectContents);
      resolvePromise(s3Map);
    };
    s3Client.getObject(
      {
        Bucket: bucketName,
        Key: bucketKey
      },
      onS3ObjectGet,
    );
  });
  const onSave = (valuesToSave) => new Promise(resolvePromise => {
    const body = JSON.stringify([...valuesToSave.entries()]
      .map(([key, value]) => serializer(key, value)));
    s3Client.putObject(
      {
        Bucket: bucketName,
        Key: bucketKey,
        Body: body,
      },
      () => resolvePromise(),
    );
  });
  return createPersistantMemoryStorage<TKey, TValue>(onLoad, onSave);
};
