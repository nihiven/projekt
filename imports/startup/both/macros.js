// HACK: i'm not sure if it's ok to add to someone else's object
// TODO: move this to projekt package?

import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';

// role macros
// returns ture if role check passes
Roles.roleCheckPasses = (userId, roles) => {
  check(userId, String);
  check(roles, Array);

  if (Roles.userIsInRole(userId, roles)) {
    return true;
  }

  return false;
};

// return true if role check fails
Roles.roleCheckFails = (user, roles, errorType) => {
  return !Roles.roleCheckPasses(user, roles, errorType);
};
Roles.adminCheckPasses = (userId) => {
  return Roles.roleCheckPasses(userId, ['admin']);
};
Roles.adminCheckFails = (userId) => {
  return !Roles.roleCheckPasses(userId, ['admin']);
};
