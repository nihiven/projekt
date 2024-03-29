// core
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { _err } from 'meteor/nihiven:projekt';

if (Meteor.isServer) {
  // exposing roles for admin functions
  Meteor.publish('roles.public', () => {
    return Meteor.roles.find({});
  });

  if (Meteor.roles.find({}).count() === 0) {
    Roles.createRole('admin');
    Roles.createRole('resource');
    Roles.createRole('project-manager');
    Roles.createRole('banned');
  }
}

Meteor.methods({
  'roles.grant': function rolesGrant(userId, role) {
    check(userId, String);
    check(role, Array);

    // user must be logged in
    if (!this.userId) {
      _err('notLoggedIn');
      return false;
    }

    // user must be an admin (for now)
    if (Roles.adminCheckFails(this.userId, 'notAdmin')) {
      _err('notAdmin');
      return false;
    }

    // can't ban yourself
    if (role.indexOf('banned') >= 0 && userId === this.userId) {
      _err('cantBanSelf');
      return false;
    }

    Roles.addUsersToRoles(userId, role);
    return true;
  },
  'roles.revoke': function rolesRevoke(userId, role) {
    check(userId, String);
    check(role, Array);

    // user must be logged in
    if (!this.userId) {
      _err('notLoggedIn');
      return false;
    }

    // user must be an admin (for now)
    if (Roles.adminCheckFails(this.userId)) {
      _err('notAdmin');
      return false;
    }

    // can't demote yourself
    if (role.indexOf('admin') >= 0 && userId === this.userId) {
      _err('cantDemoteSelf');
      return false;
    }

    Roles.removeUsersFromRoles(userId, role);
    return true;
  },
});
