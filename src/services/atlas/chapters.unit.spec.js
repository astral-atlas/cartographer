import { buildChapterService } from './chapters';
import { buildMemoryStorageService } from '../storage/memoryStorage';
import { buildMemoryRoleService } from '../role/basicRole';
import { buildBasicPermissionService } from '../permission/basicPermission';
import { generatePermission } from '../../lib/permission';
import { buildMemoryIndexer } from '../../lib/indexer';
import { generateUser } from '../../lib/user';

const generateMockUserWithRoleForPermission = async (roleService, permission) => {
  const user = generateUser();
  const role = await roleService.addRole();

  await roleService.addPermissionToRole(permission.id, role.id);
  await roleService.addUserToRole(user.id, role.id);
  return user;
}

describe('chapterService()', () => {
  it('should add a chapter for a user if they have a role with global permission that they can read', async () => {
    const globalChapterAddPermission = generatePermission();
    const chapterMemoryStorage = buildMemoryStorageService();
    const roleService = buildMemoryRoleService();
    const permissionService = buildBasicPermissionService(buildMemoryStorageService());
    const indexer = buildMemoryIndexer(
      chapterMemoryStorage.values,
      chapter => chapter.readPermission,
      (chapterPermission, userId) => roleService.getIntersectingRolesForUserAndPermission(userId, chapterPermission),
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
  });
});
