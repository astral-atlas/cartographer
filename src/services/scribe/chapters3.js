// @flow

type UserID = string;
type User = {
  id: UserID,
};

type RoleID = string;
type Role = {
  id: RoleID,
};

type UserRoleGrantID = string;
type UserRoleGrant = {
  id: UserRoleGrantID,
  userId: UserID,
  roleId: RoleID,
};

type PermissionID = string;

type RolePermissionGrantID = string;
type RolePermissionGrant = {
  id: RolePermissionGrantID,
  roleId: RoleID,
  permissionId: PermissionID,
};

type ChapterID = string;
type Chapter = {
  id: ChapterID,
  readPermission: PermissionID,
  writePermission: PermissionID,
};

type ErrorResult<TErrorType: Error> = { result: null, error: TErrorType };
type SuccessResult<SuccessType> = { result: SuccessType, error: null };

type Result<TErrorType: Error, TResultType> =
 | ErrorResult<TErrorType>
 | SuccessResult<TResultType>;

type PResult<TErrorType: Error, TResultType> = Promise<Result<TErrorType, TResultType>>;

export class Permission {
  id: PermissionID;

  constructor() {
    this.id = '124';
  }
}

/*
# Pros of Result<>
  - Strong typing
# Pros of throw new Error()
  - Easy writing
*/

const recordNewPermission = async (): PResult<Error, Permission> => {
  return new Permission();
};

const recordNewChapter = async (): PResult<Error, Chapter> => {
  const readPermission = await recordNewPermission();
  if (readPermission.error) {
    return readPermission.error;
  }
  const writePermission = await recordNewPermission();
  return
};

