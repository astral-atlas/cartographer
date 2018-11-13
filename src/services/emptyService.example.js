/* eslint-disable */
// ^^ Don't copy that part
// @flow
import type { SerializableValue } from '../types';
import { InternalServiceInitializationError, InternalServiceError, tryBuildService } from '../services';

//////
//////    Placeholder Service
//////    For all your copy-paste needs
//////

export type ServiceConfig = {
  willCrash: boolean,
};

export type Service = {
  method: () => void,
};

function ServiceStartupError() {
  return new InternalServiceInitializationError('New Service', 'Startup Error Message');
}
function ServiceSpecificError() {
  return new InternalServiceError('New Service', 'Error Message');
}

export const createService = (conf: ServiceConfig) => tryBuildService('Service name', (): Service => {
  const method = () => {};

  if (conf.willCrash) {
    throw new ServiceSpecificError();
  }

  return {
    method,
  };
});
