// @flow
import type { LoggingServiceConfig } from './services/logging';
import type { LocalStorageServiceConfig } from './services/storage/localStorage';

import { resolve } from 'path';

export type Environment = 'local' | 'test' | 'dev' | 'uat' | 'qa' | 'stag' | 'prod';

export type ScribeConfig = {
  environment: Environment,
  services: {
    logging: LoggingServiceConfig,
    localStorage: LocalStorageServiceConfig,
  },
};

export const LOCAL_CONFIG: ScribeConfig = {
  environment: 'local',
  services: {
    logging: {
      mode: 'stdout',
    },
    localStorage: {
      storageRootDirectory: resolve(__dirname, '../temp'),
    }
  }
};
