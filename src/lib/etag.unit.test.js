import { createETag } from './etag';

describe('createETag()', () => {
  it('should return an id that is stable across identical arbitrary strings or buffers', () => {
    const stringA = 'Example String A';
    const stringACopy = 'Example String A';
    const stringB = 'Example String B';

    expect(createETag(stringA)).toEqual(createETag(stringACopy));
    expect(createETag(stringA)).not.toEqual(createETag(stringB));
  });

  it('should return an id that isn\'t longer than 100 characters', () => {
    expect(createETag('Example String A').length).toBeLessThan(100);
  });
});

