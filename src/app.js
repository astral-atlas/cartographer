// @flow
import type { Route } from './lib/http';
import type { ChapterEvent } from './models/atlas/chapter/chapterEvent';
import type { RoleMemoryStructure } from './services/role/basicRole';

import { generateUser, toUser } from './lib/user';
import { buildMemoryIndexer } from './lib/indexer';

import { createS3Storage } from './services/storage/s3Storage';
import { buildPermissionService } from './services/permission/basicPermission';
import { buildChapterService } from './services/atlas/chapters';
import { buildChapterEventService } from './services/atlas/chapterEvents';
import { buildBasicUserService } from './services/user/basicUser';
import { createRoleService } from './services/role/basicRole';
import { buildStdLog } from './services/log/stdLog';

import { createChapterRoutes } from './routes/chapters';
import { createUserRoutes } from './routes/users';

export const buildAppRoutes = async (): Promise<Array<Route>> => {
  const chapterStorage =      await createS3Storage('atlas-scribe-test-data', 'chapters.json');
  const eventStorage =        await createS3Storage('atlas-scribe-test-data', 'events.json');
  const permissionStorage =   await createS3Storage('atlas-scribe-test-data', 'permissions.json');
  const roleStorage =         await createS3Storage('atlas-scribe-test-data', 'roles.json');

  // Log Service
  const logService = buildStdLog();

  // User Service
  const basicUser = toUser({ name: 'Luke', id: '123' });
  const users = [basicUser, generateUser('Dave'), generateUser('Morris')];
  const userService = buildBasicUserService(basicUser, users);

  // Permission Service
  const permissionService = buildPermissionService(permissionStorage);

  // Role Service
  const getRolesForUser = async (userId) => [...roleStorage.entries()]
    .map<RoleMemoryStructure>(([, role]) => role)
    .filter(role => role.userIds.includes(userId))
    .map(role => role.role.id);

  const getRolesForPermission = async (permissionId) => [...roleStorage.entries()]
    .map<RoleMemoryStructure>(([, role]) => role)
    .filter(role => role.permissionIds.includes(permissionId))
    .map(role => role.role.id);

  const roleService = createRoleService(
    roleStorage,
    getRolesForUser,
    getRolesForPermission,
  );

  // Create admin role, and assign the basic user to it
  const adminRole = await roleService.addRole();
  const addChapterPermission = await permissionService.addNewPermission();
  await roleService.addPermissionToRole(addChapterPermission.id, adminRole.id);
  await roleService.addUserToRole(basicUser.id, adminRole.id);

  const getChaptersByReadPermissions = buildMemoryIndexer(
    () => ([...chapterStorage.entries()].map(([,value]) => value)),
    chapter => chapter.readPermission,
    async (permissionId, userId) => (await roleService.getIntersectingRolesForUserAndPermission(userId, permissionId)).length > 0,
  );

  const chapterService = buildChapterService(
    chapterStorage,
    roleService,
    permissionService,
    addChapterPermission.id,
    getChaptersByReadPermissions,
  );

  const narrateEventByChapterIdIndex = async (chapterId) => [...eventStorage.entries()]
    .map<ChapterEvent>(([, event]) => event)
    .filter(event => event.chapterId === chapterId);

  const chapterEventService = buildChapterEventService(
    chapterStorage,
    roleService,
    eventStorage,
    narrateEventByChapterIdIndex
  );

  return [
    ...createChapterRoutes(chapterService, chapterEventService, userService, logService),
    ...createUserRoutes(userService, roleService),
  ];
};
