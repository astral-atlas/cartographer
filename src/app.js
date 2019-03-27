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
import { buildStdLog } from './services/log/stdLog';

import { createChapterRoutes } from './routes/chapters';
import { createUserRoutes } from './routes/users';

export const buildAppRoutes = async (): Promise<Array<Route>> => {
  const logService = buildStdLog();
  const basicUser = generateUser('Luke');

  const chapterStorage = buildMemoryStorageService();
  const permissionService = buildPermissionService(buildMemoryStorageService());
  const roleService = buildMemoryRoleService(buildMemoryStorageService());
  const userService = buildBasicUserService(basicUser, [basicUser, generateUser('Dave'), generateUser('Morris')]);

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

  const chapterService = buildChapterService(
    chapterStorage,
    roleService,
    permissionService,
    addChapterPermission.id,
    getChaptersByReadPermissions,
  );
  const chapterEventService = buildChapterEventService(
    chapterStorage,
    roleService,
    chapterEventStorage,
    narrateEventByChapterIdIndex
  );

  return [
    ...createChapterRoutes(chapterService, chapterEventService, userService, logService),
    ...createUserRoutes(userService, roleService),
  ];
};
