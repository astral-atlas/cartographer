// @flow

const localConfig = {
  port: 8888,
};
const testConfig = {
  port: 80,
};

export type Config = {
  port: number,
};

export const getConfig = (environment: string): Config => {
  switch (environment) {
    case 'test':
      return testConfig;
    default:
      return localConfig;
  }
};