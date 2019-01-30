// @flow

export const enhanceWithErrorHandling = <TArg, TReturn>(
  func: (arg: TArg) => Promise<TReturn>,
  errorHandlerTuples: Array<[typeof Error, (err: Error) => (Promise<TReturn>)]>,
): ((arg: TArg) => Promise<TReturn>) => async (...args) => {
    try {
      return await func(...args);
    } catch (realError) {
      const errorHandlerTuple = errorHandlerTuples.find(
        ([potentialError,]) => realError instanceof potentialError
      );
      if (!errorHandlerTuple) {
        throw realError;
      }
      return errorHandlerTuple[1](realError);
    }
  };
export const handlerErr = enhanceWithErrorHandling;
