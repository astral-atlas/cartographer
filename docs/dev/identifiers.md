# Identifiers
*Luke Kaalim*

## `generate${structure}`
Don't create constructors for data structures that use the `new` keyword. Instead, make simple arrow function's that use literal object notation. For example:
```javascript
const generateStructure = (name: string, owner: string): Structure => ({
  id: generateId(),
  name,
  owner,
});

const myStructure = generateStructure('bob', 'luke')
```

Add the prefix `generate` to the name of the structure.

## `to${structure}`
## `from${structure}`
Add the prefix `to` or `from` to serializing/deserializing functions. Recursively call other serializing/deserializing within it.

## `${identifier.toUpperCase().replace(' ', '_')}`
For module-specific variables that aren't a function declaration, the identifier should be in upper case, separated by underscores.

```javascript
const MY_LOCAL_VARIABLE = 'magic string';

const myFunction = () => {
  console.log('I can pull a string out of thin air!');
  console.log(MY_LOCAL_VARIABLE);
};
```

## `build${identifier}`
The `build` prefix denotes a factory, one that will create specific objects (typically services) provided a set of configuration and dependencies as arguments.

## `${identifier}Error`
Denotes a class that extends Error. Throw this with `new`.
