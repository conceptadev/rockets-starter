import { AccessControl } from 'accesscontrol';

export enum AppRole {
  SuperAdmin = 'SuperAdmin',
  User = 'User',
}

export enum AppResource {
  Me = 'me',
  My = 'my',
  MyUser = 'my-user',
  User = 'user',
}

const allResources = Object.values(AppResource);
const allRoles = Object.values(AppRole);

export const acRules: AccessControl = new AccessControl();

// admins can do whatever they want
acRules
  .grant([AppRole.SuperAdmin])
  .resource(allResources)
  .createOwn()
  .createAny()
  .readOwn()
  .readAny()
  .updateOwn()
  .updateAny()
  .deleteOwn()
  .deleteAny();

// user role can subscribe and unsubscribe
acRules
  .grant(AppRole.User)
  .resource([AppResource.Me, AppResource.My, AppResource.MyUser])
  .createOwn()
  .readOwn()
  .updateOwn();

// make sure nobody can delete themselves
acRules.deny(allRoles).resource(AppResource.User).deleteOwn();
