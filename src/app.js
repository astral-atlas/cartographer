// @flow
import type { Route } from './lib/http';
import type { Chapter } from './lib/chapter';
import { generateUser } from './lib/user';
import { getTupleSecond } from './lib/tuple';
import { buildBasicPermissionIndex } from './lib/permission';

import { buildMemoryStorageService } from './services/storage/memoryStorage';
import { buildBasicPermissionService } from './services/permission/basicPermission';
import { buildChapterService } from './services/atlas/chapters';
import { buildBasicUserService } from './services/user/basicUser';
import { buildMemoryRoleService } from './services/role/basicRole';

import { buildChaptersRoutes } from './routes/chapters';

export const buildAppRoutes = async (): Promise<Array<Route>> => {
  const chapterStorage = buildMemoryStorageService();
  const permissionService = buildBasicPermissionService(buildMemoryStorageService());
  const roleService = buildMemoryRoleService(buildMemoryStorageService());
  const userService = buildBasicUserService(generateUser());

  const getChaptersByReadPermissions = buildBasicPermissionIndex<Chapter>(
    async () => [...chapterStorage.entries()].map(getTupleSecond),
    chapter => chapter.readPermission,
    roleService.getIntersectingRolesForUserAndPermission,
  );

  const chapterService = buildChapterService(
    chapterStorage,
    roleService,
    permissionService,
    (await permissionService.addNewPermission()).id,
    getChaptersByReadPermissions,
  );

  return buildChaptersRoutes(chapterService, userService);
};
