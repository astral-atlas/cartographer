// @flow

export const buildMemoryIndex = <TItem, TIndex>(
  getItems: () => Array<TItem>,
  getItemIndex: (item: TItem) => TIndex,
  testIndex: (itemIndex: TIndex, indexParameter: TIndex) => boolean = (a,b) => a === b,
): (indexedProperty: TIndex) => Array<TItem> => indexedProperty => (
    getItems()
      .filter(item => testIndex(getItemIndex(item), indexedProperty))
  );
