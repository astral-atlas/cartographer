# Application Arch Glossary

## service
A service is a unit of code that cares about some other concern, outside of the code base.
Typically network, timing, input, disc access, or some other side effect. They should
track state internally, and typically have special rules about their usage (though they should be
abstracted away as much as possible).

In Astral Atlas, services are more specific. They are created by a `constructor`, return an `object interface`,
take in dependencies by `dependency injection` and are typically composed together. They live in the `services` directory
of the application source, and mostly return a `promise` of a `result` in their methods.

*For example*:

```js
/*::
type ExampleService = {
  performAction: () => Promise<Result<ActionSuccess, ActionFailure>>,
};
*/

const createExampleService = () => {
  const performAction = () => {
    return succeed(actionSuccess());
  };

  return { performAction };
};
```

## library
A library (or lib) is a unit of code that is concerned with a single, synchronous operation of one or more known data types, potentially transforming them into something else.

They key difference in a `service` and a `library` is a library doesn't perform side effects; it only operates in a simple manner and is mostly used for utility tasks.

## model
A Model is a library that is concerned with a single data type, typically with its `serialization` and `structure`.