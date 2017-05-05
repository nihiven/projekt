// HACK: i don't think it's ok to do this...
import { Roles } from 'meteor/alanning:roles';

// role macros
// returns ture if role check passes
Roles.roleCheckPasses = (userId, roles, errorMessage = false) => {
  if (Roles.userIsInRole(userId, roles)) {
    return true;
  } else {
    if (errorMessage !== false) {
      throw new Meteor.Error(403, `Not authorized: ${errorMessage}`);
    }
    return false;
  }
};
// return true if role check fails
Roles.roleCheckFails = (user, roles, errorMessage = false) => {
  return !Roles.roleCheckPasses(user, roles, errorMessage);
};
Roles.adminCheckPasses = (userId, errorMessage = false) => {
  return Roles.roleCheckPasses(userId, ['admin'], errorMessage);
};

Roles.adminCheckFails = (userId, errorMessage = false) => {
  return !Roles.roleCheckPasses(userId, ['admin'], throwError, errorMessage);
};
