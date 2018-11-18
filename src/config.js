// @flow
import { resolve } from 'path';

export type Environment = 'local' | 'test' | 'dev' | 'uat' | 'qa' | 'stag' | 'prod';

export type ScribeConfig = {
  environment: Environment,
  services: {
    storageRootDirectory: string,
  },
};

export const LOCAL_CONFIG: ScribeConfig = {
  environment: 'local',
  services: {
    storageRootDirectory: resolve(__dirname, '../temp'),
  },
};
