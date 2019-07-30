# Models

## User
```
{ userId: UserID }
```

## Login
```
{ userId: UserID, loginName: string, loginToken: string }
```
This data type is used to allow clients to authenticate themselves as a particular user.
The `loginToken` isnt accessible in normal circumstances, and the `loginName` doesnt
particularly mean anything.

## Role
```
{ roleId: RoleID }
```

## Permission
```
{ permissionId: PermissionID }
```

## Chapter
```
{ chapterId: ChapterID }
```

## Character
```
{ chatacterId: CharacterID, name: string }
```

## Timestamp
```
BigInt
```

## Session
```
{ sessionId: SessionID, name: string, runDate: Timestamp }
```