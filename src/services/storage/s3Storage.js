// @flow
/*::
import type { Storage } from '../storage.2';
import type { AWSCreds } from '../../models/config';
*/
const { S3Client } = require('@aws-sdk/client-s3-node');
const { PutObjectCommand } = require('@aws-sdk/client-s3-node/commands/PutObjectCommand');
const { GetObjectCommand } = require('@aws-sdk/client-s3-node/commands/GetObjectCommand');
const { HeadObjectCommand } = require('@aws-sdk/client-s3-node/commands/HeadObjectCommand');

const createS3Storage = (
  { accessKeyId, secretAccessKey, region } /*: AWSCreds*/,
  bucketName/*: string*/,
)/*: Storage<string, string>*/ => {
  const client = new S3Client({ region, accessKeyId, secretAccessKey });

  const read = async (key) => {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const data = await client.send(command);
    return data.Body.toString('utf-8');
  };

  const write = async (key, value) => {
    const command = new PutObjectCommand({
      Body: value,
      Bucket: bucketName,
      Key: key,
    });
    await client.send(command);
  };

  const has = async (key) => {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    try {
      await client.send(command);
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  return {
    read,
    write,
    has,
  };
};

module.exports = {
  createS3Storage
};