// @flow

export const createFailureResult = <T>(failure: T): [T, null] => [failure, null];
export const createSuccessResult = <T>(success: T): [null, T] => [null, success];

export const fail = createFailureResult;
export const succ = createSuccessResult;

export const getFailure = <T>([failure]: [T, null]): T => failure;
export const getSuccess = <T>([,success]: [null, T]): T => success;
