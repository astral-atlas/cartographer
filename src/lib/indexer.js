// @flow
import { pFilter } from './promise';

export type Indexer<TItem, TSearch> = (index: TSearch) => Promise<Array<TItem>>;

/**
 * 
 * @param {Function} getItems
 *  Get a list of items synchronously
 * @param {Function} getItemIndex 
 *  From an item, get a unique value (an 'index')
 * @param {Function} testIndex 
 *  Test an 'index' against a user input
 */
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
