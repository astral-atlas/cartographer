// @flow
import { createSuccessResult } from './result';

type InvalidArrayElementsFailure = {
  type: 'InvalidArrayElementsFailure',
  reason: string,
};
const createInvalidArrayElementsFailure = (
  failures: Array<{ index: number, reason: string }>,
  totalElements: number,
): InvalidArrayElementsFailure => ({
  type: 'InvalidArrayElementsFailure',
  reason: `${failures.length}/${totalElements} elements could not be cast.`
    + `\n${failures.map(({ reason, index }) => `${index}: ${reason}`).join('\n')}`,
});

type InvalidArrayTypeFailure = {
  type: 'InvalidArrayTypeFailure',
  reason: string,
};
const createInvalidArrayTypeFailure = (): InvalidArrayTypeFailure => ({
  type: 'InvalidArrayTypeFailure',
  reason: 'Attempted to cast a value that isn\'t an array to an array',
});

export const toArray = <TElement, TElementFailure: { type: string, reason: string }, TNextFailure, TNextResult>(
  toElement: (element: mixed) => (
    | [null, TElement]
    | [TElementFailure, null]
  ),
  next: (array: Array<TElement>) => (
    | [null, TNextResult]
    | [TNextFailure, null]
  ) = createSuccessResult,
): (value: mixed) => (
  | [null, TNextResult]
  | [TNextFailure, null]
  | [TElementFailure, null]
  | [InvalidArrayTypeFailure, null]
  | [InvalidArrayElementsFailure, null]
) => (
    value
  ) => {
    if (!Array.isArray(value)) {
      return [(createInvalidArrayTypeFailure(): InvalidArrayTypeFailure), null];
    }

    const elementResults = value.map(toElement);
    const [successes, failures] = ((
      elementResults.reduce(([successElements, failureElements], elementResult, index ) => {
        if (elementResult[0] === null) {
          const success = elementResult[1];
          success !== null && successElements.push(success);
        } else {
          const failure = elementResult[0];
          failure !== null && failureElements.push({ reason: `[${failure.type}] ${failure.reason}`, index });
        }
        return [successElements, failureElements];
      }, [[], []])
    ): [Array<TElement>, Array<{ reason: string, index: number }>]);
    
    if (failures.length > 1) {
      return ([createInvalidArrayElementsFailure(failures, value.length), null]: [InvalidArrayElementsFailure, null]);
    }

    return next(successes);
  };

type InvalidPropertyTypeFailure = {
  type: 'InvalidPropertyTypeFailure',
  reason: string,
};
const createInvalidPropertyTypeFailure = (
  propName: string,
  propFailure: { type: string, reason: string},
): InvalidPropertyTypeFailure => ({
  type: 'InvalidPropertyTypeFailure',
  reason: `Could not create property "${propName}" because:\n[${propFailure.type}] ${propFailure.reason}`,
});

export const withProp = function <
  TObject: {},
  TPropName: string,
  TPropValue,
  TPropFailure: { type: string, reason: string } | null,
  TNextValue,
  TNextFailure: { type: string, reason: string } | null
>(
  propName: TPropName,
  getProp: (value: mixed) => (
    | [TPropFailure, null]
    | [null, TPropValue]
  ),
  next: (value: { ...TObject, [TPropName]: TPropValue }) => (
    | [TNextFailure, null]
    | [null, TNextValue]
  ) = createSuccessResult,
): (value: TObject) => (
  | [TNextFailure, null]
  | [TPropFailure, null]
  | [InvalidPropertyTypeFailure, null]
  | [null, TNextValue]
) {
  return (value) => {
    const [failure, prop] = getProp(value[propName]);
    if (failure !== null) {
      return ([createInvalidPropertyTypeFailure(propName, failure), null]: [InvalidPropertyTypeFailure, null]);
    }
    if (prop !== null) {
      return next({ ...value, [propName]: prop });
    }
    throw new Error('Impossible case');
  };
};

type InvalidStringTypeFailure = {
  type: 'InvalidStringTypeFailure',
  reason: string,
}
const createInvalidStringTypeFailure = (notAString: mixed): InvalidStringTypeFailure => ({
  type: 'InvalidStringTypeFailure',
  reason: `Received ${typeof notAString} instead of string!`,
});

export const toString = function <TNextSuccess, TNextFailure: { reason: string, type: string }>(
  next: (value: string) => (
    | [null, TNextSuccess]
    | [TNextFailure, null]
  ) = createSuccessResult,
): (value: mixed) => (
  | [null, TNextSuccess]
  | [TNextFailure, null]
  | [InvalidStringTypeFailure, null]
) {
  return (value) => (
    typeof value === 'string' ?
      next(value)
      :
      ([createInvalidStringTypeFailure(value), null]: [InvalidStringTypeFailure, null])
  );
};

type InvalidObjectTypeFailure = {
  type: 'InvalidObjectTypeFailure',
  reason: string,
}
const createInvalidObjectTypeFailure = (notAnObject: mixed): InvalidObjectTypeFailure => ({
  type: 'InvalidObjectTypeFailure',
  reason: `Received ${notAnObject === null ? 'null' : typeof notAnObject} instead of object!`,
});

export const toObject = function <TNextSuccess, TNextFailure: { reason: string, type: string }>(
  next: (value: { [string]: mixed }) => (
    | [null, TNextSuccess]
    | [TNextFailure, null]
  ) = createSuccessResult,
): (value: mixed) => (
  | [null, TNextSuccess]
  | [TNextFailure, null]
  | [InvalidObjectTypeFailure, null]
) {
  return (value) => (
    typeof value === 'object' && value !== null ?
      next(value)
      :
      ([createInvalidObjectTypeFailure(value), null]: [InvalidObjectTypeFailure, null])
  );
};

type ToUser = (value: {}) => (
  | [InvalidStringTypeFailure, null]
  | [InvalidPropertyTypeFailure, null]
  | [null, { id: string }]
);

// $FlowFixMe
export const toUser: ToUser = (withProp('id', toString()): any);
