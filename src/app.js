// @flow
import type { Route } from './lib/http';
import type { Chapter } from './lib/chapter';
import { generateUser } from './lib/user';
import { buildBasicPermissionIndex } from './lib/permission';
import { async } from './lib/promise';

import { buildMemoryStorageService } from './services/storage/memoryStorage';
import { buildBasicPermissionService } from './services/permission/basicPermission';
import { buildChapterService } from './services/atlas/chapters';
import { buildBasicUserService } from './services/user/basicUser';
import { buildMemoryRoleService } from './services/role/basicRole';

import { buildChaptersRoutes } from './routes/chapters';

export const buildAppRoutes = async (): Promise<Array<Route>> => {
  const basicUser = generateUser();

  const chapterStorage = buildMemoryStorageService();
  const permissionService = buildBasicPermissionService(buildMemoryStorageService());
  const roleService = buildMemoryRoleService(buildMemoryStorageService());
  const userService = buildBasicUserService(basicUser);

  const addChapterPermission = await permissionService.addNewPermission();
  const adminRole = await roleService.addRole();
  await roleService.addPermissionToRole(addChapterPermission.id, adminRole.id);
  await roleService.addUserToRole(basicUser.id, adminRole.id);

  const getChaptersByReadPermissions = buildBasicPermissionIndex<Chapter>(
    async(chapterStorage.values),
    chapter => chapter.readPermission,
    roleService.getIntersectingRolesForUserAndPermission,
  );

  const chapterService = buildChapterService(
    chapterStorage,
    roleService,
    permissionService,
    addChapterPermission.id,
    getChaptersByReadPermissions,
  );

  return buildChaptersRoutes(chapterService, userService);
};
