// @flow
import type { PermissionService } from '../permission';
import type { PermissionID, Permission } from '../../lib/permission';
import type { StorageService } from '../storage';
import { generatePermission } from '../../lib/permission';

export const buildPermissionService = (
  permissionStorageService: StorageService<PermissionID, Permission>,
): PermissionService => {
  const addNewPermission = async () => {
    const newPermission = generatePermission();
    permissionStorageService.create(newPermission.id, newPermission);
    return newPermission;
  };
  const getPermission = async (permissionId) => {
    return await permissionStorageService.read(permissionId);
  };
  return {
    addNewPermission,
    getPermission,
  };
};
