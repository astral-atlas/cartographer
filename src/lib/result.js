// @flow
/*::
  export type Success<TSuccess> = {
    type: 'success',
    value: TSuccess
  };
  export type Failure<TFailure> = {
    type: 'failure',
    value: TFailure
  }
  export type Result<TSuccess, TFailure> =
    | { type: 'success', value: TSuccess }
    | { type: 'failure', value: TFailure };
*/
export const createSuccess = /*:: <TSuccess>*/(value/*:: :TSuccess*/)/*:: :Success<TSuccess> */ => ({
  type: 'success',
  value,
});
export const createFailure = /*:: <TFailure>*/(value/*:: :TFailure*/)/*:: :Failure<TFailure> */ => ({
  type: 'failure',
  value,
});