export class AtlasScribeClient {
  atlasDomain = new URL('http://localhost:8888');
  user = 'default_user';

  async getUsers() {
    const getUsersEndpoint = new URL('/users', this.atlasDomain);
    const response = await fetch(getUsersEndpoint);
    const users = await response.json();

    return users;
  }

  async getChapters() {
    const getChaptersEndpoint = new URL('/chapters', this.atlasDomain);
    const response = await fetch(getChaptersEndpoint);
    const chapters = await response.json();

    return chapters;
  }
}
