import { buildChapterService } from './chapters';
import { buildMemoryStorageService } from '../storage/memoryStorage';
import { buildMemoryRoleService } from '../role/basicRole';
import { buildPermissionService } from '../permission/basicPermission';
import { buildNarrateEvent } from '../../models/atlas/chapter/narrateEvent';
import { generatePermission } from '../../lib/permission';
import { buildMemoryIndexer } from '../../lib/indexer';
import { generateUser } from '../../lib/user';

const generateMockUserWithRoleForPermission = async (roleService, permission) => {
  const user = generateUser();
  const role = await roleService.addRole();

  await roleService.addPermissionToRole(permission.id, role.id);
  await roleService.addUserToRole(user.id, role.id);
  return user;
};

const buildMockChapterEventService = () => {
  const events = new Map();

  const getEvents = async (chapterId) => {
    return events.get(chapterId) || [];
  };
  
  const addNarrateEvent = async (chapterId, narration) => {
    events.set(
      chapterId,
      [
        ...(events.get(chapterId) || []),
        buildNarrateEvent(chapterId, narration),
      ]);
  };

  return {
    getEvents,
    addNarrateEvent,
  };
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
      buildMockChapterEventService()
    );

    const chapter = await chapterService.addNewChapter(user.id, 'New Chapter');
    expect(await chapterService.getChapter(user.id, chapter.id)).toEqual({ chapter, events: [] });
    expect(await chapterService.getAllChapters(user.id)).toEqual([chapter]);
  });
});
