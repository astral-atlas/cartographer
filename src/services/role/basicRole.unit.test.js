import { buildMemoryRoleService } from './basicRole';
import { generateUser } from '../../lib/user';
import { generatePermission } from '../../lib/permission';

describe('Basic Memory Role Service', () => {
  it('should add and retrieve roles', async () => {
    const roleService = buildMemoryRoleService();

    const newRole = await roleService.addRole();
    expect(await roleService.getRole(newRole.id)).toEqual(newRole);
  });
  it('should add a permission and user to the role', async () => {
    const roleService = buildMemoryRoleService();

    const permission = generatePermission();
    const user = generateUser();
    const role = await roleService.addRole();
    
    await roleService.addPermissionToRole(permission.id, role.id);
    await roleService.addUserToRole(user.id, role.id);

    expect(await roleService.getRolesForPermission(permission.id)).toEqual([role.id]);
    expect(await roleService.getRolesForUser(user.id)).toEqual([role.id]);

    expect(await roleService.getIntersectingRolesForUserAndPermission(user.id, permission.id)).toEqual([role.id]);

    const unusedPermission = generatePermission();
    const unusedUser = generateUser();

    expect(await roleService.getRolesForPermission(unusedPermission.id)).toEqual([]);
    expect(await roleService.getRolesForUser(unusedUser.id)).toEqual([]);
  });
});
