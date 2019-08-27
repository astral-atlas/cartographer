// @flow
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

module.exports = {
  succeed,
  fail,
};
