export const createAtlasClient = (endpoint) => {
  let responseCache = new Map();

  const getUsers = async () => {
    const getUsersEndpoint = new URL('/users', endpoint);
    const options = {
      cache: 'no-cache',
    };
    const response = await fetch(getUsersEndpoint, options);
    const eTag = response.headers.get('ETag');
    if (eTag && responseCache.has(eTag)) {
      return responseCache.get(eTag);
    }
    const users = await response.json();
    responseCache.set(eTag, users);
    return users;
  }
  
  const getChapters = async (userId) => {
    const getChaptersEndpoint = new URL('/chapters', endpoint);
    const options = {
      headers: {
        'user-id': userId,
      },
    };
    const response = await fetch(getChaptersEndpoint, options);
    const chapters = await response.json();
  
    return chapters;
  }

  const putNewChapter = async (chapterName, userId) => {
    const getChaptersEndpoint = new URL('/chapters', endpoint);
    const options = {
      method: 'POST',
      headers: {
        'user-id': userId,
      },
      body: JSON.stringify({ chapterName }),
    };
    await fetch(getChaptersEndpoint, options);
  };

  return {
    getUsers,
    getChapters,
    putNewChapter,
  };
};
