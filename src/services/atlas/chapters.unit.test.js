const { buildChapterService } = require('./chapters');
const { buildMemoryStorageService } = require('../storage/memoryStorage');
const { buildMemoryRoleService } = require('../role/basicRole');
const { buildPermissionService } = require('../permission/basicPermission');
const { generatePermission } = require('../../lib/permission');
const { buildMemoryIndexer } = require('../../lib/indexer');
const { generateUser } = require('../../lib/user');

const generateMockUserWithRoleForPermission = async (roleService, permission) => {
  const user = generateUser();
  const role = await roleService.addRole();

  await roleService.addPermissionToRole(permission.id, role.id);
  await roleService.addUserToRole(user.id, role.id);
  return user;
};

describe('chapterService()', () => {
  it('should add a chapter for a user if they have a role with global permission that they can read', async () => {
    const globalChapterAddPermission = generatePermission();
    const chapterMemoryStorage = buildMemoryStorageService();
    const roleService = buildMemoryRoleService();
    const permissionService = buildPermissionService(buildMemoryStorageService());
    const indexer = buildMemoryIndexer(
      chapterMemoryStorage.values,
      chapter => chapter.readPermission,
      async (chapterPermission, userId) => (await roleService.getIntersectingRolesForUserAndPermission(userId, chapterPermission)).length > 0,
    );

    const user = await generateMockUserWithRoleForPermission(roleService, globalChapterAddPermission);

    const chapterService = buildChapterService(
      chapterMemoryStorage,
      roleService,
      permissionService,
      globalChapterAddPermission.id,
      indexer,
    );

    const chapter = await chapterService.addNewChapter(user.id, 'New Chapter');
    expect(await chapterService.getChapter(user.id, chapter.id)).toEqual(chapter);
    expect(await chapterService.getAllChapters(user.id)).toEqual([chapter]);

    const differentUser = await generateMockUserWithRoleForPermission(roleService, generatePermission());
    expect(await chapterService.getAllChapters(differentUser.id)).toEqual([]);
  });
});
