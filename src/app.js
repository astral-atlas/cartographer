// @flow
import type { Route } from './lib/http';
import type { RoleID, Role } from './lib/role';
import type { PermissionID, Permission } from './lib/permission';
import { buildNewPermission } from './lib/permission';
import { generateUser } from './lib/user';

import { buildMemoryStorageService } from './services/storage/memoryStorage';
import { buildBasicPermissionService } from './services/permission/basicPermission';
import { buildChapterService } from './services/atlas/chapters';
import { buildBasicUserService } from './services/user/basicUser';

import { buildChaptersRoutes } from './routes/chapters';

export const buildAppRoutes = async (): Promise<Array<Route>> => {
  const chapterStorage = buildMemoryStorageService();
  const roleStorage = buildMemoryStorageService<RoleID, Role>();
  const permissionStorage = buildMemoryStorageService<PermissionID, Permission>();

  const getUserRoles = async (userId) => (
    [...roleStorage.entries()]
      .filter(([, role]) => role.userId === userId)
      .map(([roleId]) => roleId)
  );
  
  const getPermissionRoles = async (permissionId) => (
    [...roleStorage.entries()]
      .filter(([, role]) => role.permissionId === permissionId)
      .map(([roleId]) => roleId)
  );

  const permissionService = buildBasicPermissionService(permissionStorage, getUserRoles, getPermissionRoles);

  const getChaptersByReadPermissions = async (userId) => {
    const userRoleIds = await getUserRoles(userId);
    const userRoles = await Promise.all(userRoleIds.map(roleStorage.read));
    const readableChapters = [...chapterStorage.entries()]
      .filter(([,chapter]) => userRoles.find(role => role.permissionId === chapter.readPermission))
      .map(([,chapter]) => chapter);
    return readableChapters;
  };

  const userService = buildBasicUserService(generateUser());

  const chapterService = buildChapterService(
    chapterStorage,
    permissionService,
    buildNewPermission(),
    getChaptersByReadPermissions
  );

  return buildChaptersRoutes(chapterService, userService);
};
