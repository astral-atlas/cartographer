const createEtagCache = () => {
  const cache = new Map();

  const getCachedResponse = (eTag) => {
    if (eTag && cache.has(eTag)) {
      return cache.get(eTag);
    }
    return null;
  };

  const updateCache = (eTag, response) => {
    if (eTag) {
      cache.set(eTag, response);
    }
  };

  return {
    getCachedResponse,
    updateCache,
  };
};

const cachedFetch = async (endpoint, options, cache) => {
  const response = await fetch(endpoint, options);
  const eTag = response.headers.get('ETag');
  const data = cache.getCachedResponse(eTag) || await response.json();
  cache.updateCache(eTag, data);
  return data;
}

export const createAtlasClient = (endpoint) => {
  const responseCache = createEtagCache();

  const getUsers = async () => {
    const getUsersEndpoint = new URL('/users', endpoint);
    const options = {
      cache: 'no-cache',
    };
    return await cachedFetch(getUsersEndpoint, options, responseCache);
  }
  const getUserRoles = async (userId) => {
    const getRolesEndpoint = new URL('/users/roles', endpoint);
    getRolesEndpoint.searchParams.append('userId', userId);
    const options = {
      cache: 'no-cache',
    };
    return await cachedFetch(getRolesEndpoint, options, responseCache);
  }
  
  const getChapters = async (userId) => {
    const getChaptersEndpoint = new URL('/chapters', endpoint);
    const options = {
      headers: {
        'user-id': userId,
      },
    };
    return await cachedFetch(getChaptersEndpoint, options, responseCache);
  }

  const getChapterById = async (userId, chapterId) => {
    const getChapterByIdEndpoint = new URL('/chapters', endpoint);
    getChapterByIdEndpoint.searchParams.append('id', chapterId);
    const options = {
      headers: {
        'user-id': userId,
      },
    };
    return await cachedFetch(getChapterByIdEndpoint, options, responseCache);
  }

  const getChapterEvents = async (userId, chapterId) => {
    const getChapterByIdEndpoint = new URL('/chapters/events', endpoint);
    getChapterByIdEndpoint.searchParams.append('chapterId', chapterId);
    const options = {
      headers: {
        'user-id': userId,
      },
    };
    return await cachedFetch(getChapterByIdEndpoint, options, responseCache);
  };

  const putNewChapter = async (chapterName, userId) => {
    const chaptersEndpoint = new URL('/chapters', endpoint);
    const options = {
      method: 'POST',
      headers: {
        'user-id': userId,
      },
      body: JSON.stringify({ chapterName }),
    };
    await fetch(chaptersEndpoint, options);
  };

  const putNewChapterEvent = async (chapterId, userId, event) => {
    const chaptersEventEndpoint = new URL('/chapters/events', endpoint);
    chaptersEventEndpoint.searchParams.append('chapterId', chapterId);
    const options = {
      method: 'POST',
      headers: {
        'user-id': userId,
      },
      body: JSON.stringify(event),
    };
    await fetch(chaptersEventEndpoint, options);
  };

  return {
    getUsers,
    getChapters,
    getChapterById,
    getChapterEvents,
    putNewChapter,
    putNewChapterEvent,
    getUserRoles,
  };
};
