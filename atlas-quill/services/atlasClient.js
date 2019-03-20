export const createAtlasClient = (endpoint) => {
  let responseCache = new Map();

  const getUsers = async () => {
    const getUsersEndpoint = new URL('/users', endpoint);
    const response = await fetch(getUsersEndpoint, { cache: 'no-cache' });
    const eTag = response.headers.get('ETag');
    if (eTag && responseCache.has(eTag)) {
      return responseCache.get(eTag);
    }
    const users = await response.json();
    responseCache.set(eTag, users);
    return users;
  }
  
  const getChapters = async (user) => {
    const getChaptersEndpoint = new URL('/chapters', endpoint);
    getChaptersEndpoint.searchParams.append('asUser', user);
    const response = await fetch(getChaptersEndpoint);
    const chapters = await response.json();
  
    return chapters;
  }

  return {
    getUsers,
    getChapters,
  };
};
