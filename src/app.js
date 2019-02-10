// @flow
import type { Route } from './lib/http';
import { generateUser } from './lib/user';
import { buildMemoryIndexer } from './lib/indexer';

import { buildMemoryStorageService } from './services/storage/memoryStorage';
import { buildPermissionService } from './services/permission/basicPermission';
import { buildChapterService } from './services/atlas/chapters';
import { buildChapterEventService } from './services/atlas/chapterEvents';
import { buildBasicUserService } from './services/user/basicUser';
import { buildMemoryRoleService } from './services/role/basicRole';

import { buildChaptersRoutes } from './routes/chapters';

export const buildAppRoutes = async (): Promise<Array<Route>> => {
  const basicUser = generateUser();

  const chapterStorage = buildMemoryStorageService();
  const permissionService = buildPermissionService(buildMemoryStorageService());
  const roleService = buildMemoryRoleService(buildMemoryStorageService());
  const userService = buildBasicUserService(basicUser);

  const addChapterPermission = await permissionService.addNewPermission();
  const adminRole = await roleService.addRole();
  await roleService.addPermissionToRole(addChapterPermission.id, adminRole.id);
  await roleService.addUserToRole(basicUser.id, adminRole.id);

  const getChaptersByReadPermissions = buildMemoryIndexer(
    chapterStorage.values,
    chapter => chapter.readPermission,
    async (permissionId, userId) => (await roleService.getIntersectingRolesForUserAndPermission(userId, permissionId)).length > 0,
  );
  
  const chapterEventStorage = buildMemoryStorageService();

  const narrateEventByChapterIdIndex = buildMemoryIndexer(
    chapterEventStorage.values,
    chapterEvent => chapterEvent.chapterId,
  );
  const chapterEventService = buildChapterEventService(chapterEventStorage, narrateEventByChapterIdIndex);

  const chapterService = buildChapterService(
    chapterStorage,
    roleService,
    permissionService,
    addChapterPermission.id,
    getChaptersByReadPermissions,
    chapterEventService,
  );

  return buildChaptersRoutes(chapterService, userService);
};
