// @flow
import { pFilter } from './promise';

export type Indexer<TItem, TSearch> = (index: TSearch) => Promise<Array<TItem>>;

export const buildMemoryIndexer = <TItem, TIndex, TSearch>(
  getItems: () => Array<TItem>,
  getItemIndex: (item: TItem) => TIndex,
  testIndex: (itemIndex: TIndex, indexParameter: TSearch) => Promise<boolean> = async (a,b) => a === b,
): Indexer<TItem, TSearch> => async (indexedProperty) => (
    pFilter(
      getItems(),
      item => testIndex(getItemIndex(item), indexedProperty),
    )
  );
