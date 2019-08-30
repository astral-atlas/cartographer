// @flow strict

/*
  Result is a data type that represents a single branch in execution,
  where one branch performs the expected operation, and another handles
  a case where something unexpected happened.
  This is slightly more useful to use because it forces the developer to
  handle the error cases before accessing the value.
*/
/*::
  export type Success<TSuccess> = {
    type: 'success',
    success: TSuccess
  };
  export type Failure<TFailure> = {
    type: 'failure',
    failure: TFailure
  }
  export type Result<TSuccess, TFailure> =
    | Failure<TFailure>
    | Success<TSuccess>
*/
const succeed = /*:: <TSuccess>*/(success/*:: :TSuccess*/)/*:: :Success<TSuccess> */ => ({
  type: 'success',
  success,
});
const fail = /*:: <TFailure>*/(failure/*:: :TFailure*/)/*:: :Failure<TFailure> */ => ({
  type: 'failure',
  failure,
});

// Simple handler function: if the result is successful, goto the second argument, it fails, goto the third
const handleResult = /*:: <TSuccess, TFailure, TOnSuccessResult, TOnFailureResult> */(
  result/*: Result<TSuccess, TFailure>*/,
  onSuccess/*: (success: TSuccess) => TOnSuccessResult*/,
  onFailure/*: (failure: TFailure) => TOnFailureResult*/
)/*: TOnSuccessResult | TOnFailureResult*/ => {
  if (result.type === 'success') {
    return onSuccess(result.success);
  } else {
    return onFailure(result.failure);
  }
};

module.exports = {
  succeed,
  fail,
  handleResult,
};
