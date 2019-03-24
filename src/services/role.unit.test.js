import { generatePermission } from '../lib/permission';
import { generateUser } from '../lib/user';
import { buildMemoryStorageService } from './storage/memoryStorage';

import { addRoleWithPermissionsAndUsers } from './role';
import { buildMemoryRoleService } from './role/basicRole';

describe('addRoleWithPermissionsAndUsers()', () => {
  it('should create a role that grants the permissions to the given user', async () => {
    const store = buildMemoryStorageService();
    const service = buildMemoryRoleService(store);
    const permission = generatePermission();
    const user = generateUser();

    const role = await addRoleWithPermissionsAndUsers(service, [user.id], [permission.id]);

    expect(await service.getIntersectingRolesForUserAndPermission(user.id, permission.id)).toEqual([role.id]);
  });
});
