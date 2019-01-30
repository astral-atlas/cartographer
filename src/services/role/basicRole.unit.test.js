import { buildMemoryRoleService } from './basicRole';
import { buildMemoryStorageService } from '../storage/memoryStorage';

describe('Basic Memory Role Service', () => {
  it('should add and retrieve roles', async () => {
    const storage = buildMemoryStorageService();

    const roleService = buildMemoryRoleService(storage);

    const newRole = await roleService.addRole();
    expect(await roleService.getRole(newRole.id)).toEqual(newRole);
  });
  it('should add a permission and user to the role', () => {

  });
})
