// @flow

export const enhanceWithErrorHandling = <TArg, TReturn>(
  func: (arg: TArg) => TReturn,
  errorHandlerTuples: Array<[typeof Error, (err: Error) => (TReturn)]>,
): ((arg: TArg) => TReturn) => (...args) => {
    try {
      return func(...args);
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
