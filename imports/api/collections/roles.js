/*
  We'll need to make some decisions on what roles are available globally
  and what roles are project specific. Then decide what roles can grant
  and revoke these roles in each case.

  GLOBAL
  admin
  project-mgr
  normal-user
  view-only
  ????

  PROJECT
  contributor
*/
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { projekt } from 'meteor/projekt';

// exposing roles for admin functions
Meteor.publish('roles.all', () => {
  return Meteor.roles.find({});
});

Meteor.methods({
  'roles.grant'(userId, role) {
    check(userId, String);
    check(role, Array);

    // user must be logged in
    if (!this.userId) {
      projekt.err('notLoggedIn');
      return false;
    }

    // user must be an admin (for now)
    if (Roles.adminCheckFails(this.userId, 'notAdmin')) {
      projekt.err('notAdmin');
      return false;
    }

    Roles.addUsersToRoles(userId, role);
    return true;
  },
  'roles.revoke'(userId, role) {
    check(userId, String);
    check(role, Array);

    // user must be logged in
    if (!this.userId) {
      projekt.err('notLoggedIn');
      return false;
    }

    // user must be an admin (for now)
    if (Roles.adminCheckFails(this.userId)) {
      projekt.err('notAdmin');
      return false;
    }

    Roles.removeUsersFromRoles(userId, role);
    return true;
  },
});
