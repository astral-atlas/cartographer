
// lib/result
export const createFailureResult = (failure) => [failure, null];
export const createSuccessResult = (success) => [null, success];

export const fail = createFailureResult;
export const succ = createSuccessResult;

export const getFailure = ([failure]) => failure;
export const getSuccess = ([,success]) => success;

// lib/array
export const splinter = (array, filter) => [
  array(element => filter(element)),
  array(element => !filter(element)),
];

// lib/cast
type InvalidStringTypeFailure = {
  reason: string,
  type: 'InvalidStringTypeFailure'
}
const createInvalidStringTypeFailure = (notAString) => createFailure(
  `Received ${typeof notAString} instead of string!`,
  'InvalidStringTypeFailure'
);

export const toString = (next = createSuccessResult) => (value) => (
  typeof value === 'string' ?
    next(value)
    :
    fail(createInvalidStringTypeFailure(value))
);

type InvalidObjectTypeFailure = {
  reason: string,
  type: 'InvalidObjectTypeFailure'
}
const createInvalidObjectTypeFailure = (notAString) => createFailure(
  `Received ${typeof notAString} instead of object!`,
  'InvalidObjectTypeFailure'
);
type NullObjectTypeFailure = {
  reason: string,
  type: 'NullObjectTypeFailure'
}
const createNullObjectTypeFailure = () => createFailure(
  'Received null instead of object!',
  'NullObjectTypeFailure',
);

export const toObject = (next = createSuccessResult) => (value) => (
 typeof value !== 'object' ?
    fail(createInvalidObjectTypeFailure(value))
    :
    value === null ?
      fail(createNullObjectTypeFailure())
  		:
  		next(value)
)

type InvalidPropertyTypeFailure<T: { reason: string }> = {
  reason: string,
  type: 'InvalidPropertyTypeFailure',
  subFailure: T,
};
const createInvalidPropertyTypeFailure = (propName, propFailure) => ({
  type: 'InvalidPropertyTypeFailure',
  reason: `Could not create property "${propName}" because ${propFailure.reason}`,
  propFailure,
});

export const withProp = (propName, getProp, next = createSuccessResult) => (value) => {
  const [failure, prop] = getProp(value[propName]);
  return failure ?
    fail(createInvalidPropertyTypeFailure(propName, failure))
    :
    next({ ...value, [propName]: prop });
};

type InvalidArrayElementsFailure = {
  type: 'InvalidArrayElementsFailure',
  reason: string,
}
const createInvalidArrayElementsFailure = (failureElements, successElements) => ({
  type: 'InvalidArrayElementsFailure',
  reason: `${failureElements.length}/${successElements.length + failureElements.length} elements could not be cast.`
    + `\n${failureElements.map((failure, index) => `${index}: ${failure.reason}\n`)}`,
  failureElements,
  successElements,
});

export const toArray = (toElement, next = createSuccessResult) = (value) => {
  const [failureElements, successElements] = splinter(value.map(toElement), getFailure);
  return failureElements.length > 1 ?
    fail(createInvalidArrayElementsFailure(failureElements.map(getFailure), successElements.map(getSuccess)))
    :
    next(successElements.map(getSuccess));
}

// model/user
type User = {
  id: string,
  displayName: string,
};
export const toUser = toObject(withProp('id', toString(), withProp('displayName', toString())));

// main
const entry = () => {
  const [failure, user] = toUser({ id: '123', displayName: '123' });
  if (failure) {
    console.log('Failed to cast to User');
    return;
  }
  console.log(user.id);
  console.log(user.displayName);
};
entry();
