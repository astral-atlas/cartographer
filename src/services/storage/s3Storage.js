// @flow strict
/*::
import type { STDMapStore } from '../storage';
import type { AWSCreds } from '../../models/config';
*/
const { S3Client } = require('@aws-sdk/client-s3-node');
const { PutObjectCommand } = require('@aws-sdk/client-s3-node/commands/PutObjectCommand');
const { GetObjectCommand } = require('@aws-sdk/client-s3-node/commands/GetObjectCommand');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3-node/commands/DeleteObjectCommand');
const { ListObjectsCommand } = require('@aws-sdk/client-s3-node/commands/ListObjectsCommand');
const { succeed } = require('@lukekaalim/result');

const createS3Storage = (
  { accessKeyId, secretAccessKey, region } /*: AWSCreds*/,
  bucketName/*: string*/,
)/*: STDMapStore<string, string>*/ => {
  const client = new S3Client({ region, accessKeyId, secretAccessKey });

  const read = async (key) => {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    const data = await client.send(command);
    return succeed(data.Body.toString('utf-8'));
  };

  const write = async (key, value) => {
    const command = new PutObjectCommand({
      Body: value,
      Bucket: bucketName,
      Key: key,
    });
    return succeed(await client.send(command));
  };

  const destroy = async (key) => {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    return succeed(await client.send(command));
  }

  const list = async () => {
    const command = new ListObjectsCommand({
      Bucket: bucketName,
    });
    const response = await client.send(command);
    return succeed(response.Contents.map(content => content.Key));
  };

  return {
    read,
    write,
    destroy,
    list,
  };
};

module.exports = {
  createS3Storage
};