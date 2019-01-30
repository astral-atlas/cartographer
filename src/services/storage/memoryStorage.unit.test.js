import { buildMemoryStorageService } from './memoryStorage';

describe('memoryStorage() instance', () => {
  it('should create, read, update a primitive type', async () => {
    const memoryStorageService = buildMemoryStorageService();

    const storedKey = 'random-key';
    const storedValue = 'random-value';

    await memoryStorageService.create(storedKey, storedValue);
    expect(await memoryStorageService.read(storedKey)).toEqual(storedValue);

    const newValue = 'a-different-value';

    await memoryStorageService.update(storedKey, newValue);
    expect(await memoryStorageService.read(storedKey)).toEqual(newValue);
  });
  it('should read and update based on the map that was passed to the factory', async () => {
    const firstPair = [0, 'The number zero'];
    const secondPair = [1, 'The number one'];
    const baseMap = new Map([firstPair, secondPair]);

    const memoryStorageService = buildMemoryStorageService(baseMap);

    const firstStorageResult = await memoryStorageService.read(0);
    const secondStorageResult = await memoryStorageService.read(1);

    expect(firstStorageResult).toEqual('The number zero');
    expect(secondStorageResult).toEqual('The number one');
  });
});
