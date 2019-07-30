const { buildMemoryIndexer } = require('./indexer');

describe('buildMemoryIndexer()', () => {
  it('should make a function that can retrieve a set of value by an arbitrary property', async () => {
    const items = [
      { prop: 1 },
      { prop: 2 },
      { prop: 3 },
      { prop: 3 },
    ];

    const indexer = buildMemoryIndexer(() => items, item => item.prop);

    expect(await indexer(1)).toEqual([{ prop: 1 }]);
    expect(await indexer(3)).toEqual([{ prop: 3 }, { prop: 3 }]);
  });
  it('should make a function that can retrieve a set of values by a comparison', async () => {
    const items = [
      { prop: 1 },
      { prop: 2 },
      { prop: 3 },
      { prop: 3 },
    ];

    const indexer = buildMemoryIndexer(() => items, item => item.prop, async (a,b) => a <= b);

    expect(await indexer(1)).toEqual([{ prop: 1 }]);
    expect(await indexer(2)).toEqual([{ prop: 1 }, { prop: 2 }]);
  });
});
