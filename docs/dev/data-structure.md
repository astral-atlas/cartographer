# Data structures
*Luke Kaalim*

Data structures are described in `/src/lib/${structure}` using **flow**. A typical structure might look like this

```javascript
type Structure {
  id: StructureID,
  field: string,
  foreignId: ForeignID,
  properties: Array<{ configuration: boolean }>,
};
```

Structures should be designed to be stored across a number of solutions, and be capable of being serialized to a string. Deserialization functions should be provided with the prefix 'to'. For example: `toStructure(string);` as per the above example.

Connections to other data structures should be mindful of potential storage issues. For instance, keeping an array of foreign keys is problematic, as when stored using a database and queries using SQL, you will need to deserialize the array before you can follow the foreign keys. Using a *junction table* or other methods to connect the data structures is ideally an implementation detail, and you should be able to omit the specifics in the data structure description.
