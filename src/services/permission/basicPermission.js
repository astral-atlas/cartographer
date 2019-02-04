// @flow
import type { PermissionService } from '../permission';
import type { PermissionID, Permission } from '../../lib/permission';
import type { StorageService } from '../storage';
import { generatePermission } from '../../lib/permission';

export const buildBasicPermissionService = (
  permissionStorageService: StorageService<PermissionID, Permission>,
): PermissionService => {
  const addNewPermission = async () => {
    const newPermission = generatePermission();
    permissionStorageService.create(newPermission.id, newPermission);
    return newPermission;
  };
  return {
    addNewPermission,
  };
};
