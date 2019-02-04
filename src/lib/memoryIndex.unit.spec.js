import { buildMemoryIndex } from './memoryIndex';

describe('buildMemoryIndex()', () => {
  it('should make a function that can retrieve a set of value by an arbitrary property', () => {
    const items = [
      { prop: 1 },
      { prop: 2 },
      { prop: 3 },
      { prop: 3 },
    ];

    const indexer = buildMemoryIndex(() => items, item => item.prop);

    expect(indexer(1)).toEqual([{ prop: 1 }]);
    expect(indexer(3)).toEqual([{ prop: 3 }, { prop: 3 }]);
  });
  it('should make a function that can retrieve a set of values by a comparison', () => {
    const items = [
      { prop: 1 },
      { prop: 2 },
      { prop: 3 },
      { prop: 3 },
    ];

    const indexer = buildMemoryIndex(() => items, item => item.prop, (a,b) => a <= b);

    expect(indexer(1)).toEqual([{ prop: 1 }]);
    expect(indexer(2)).toEqual([{ prop: 1 }, { prop: 2 }]);
  });
});
