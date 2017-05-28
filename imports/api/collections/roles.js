// core
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { projekt, defaults, _log } from 'meteor/nihiven:projekt';

if (Meteor.isServer) {
  if (Meteor.roles.find({}).count() === 0) {
    Roles.createRole('admin');
    Roles.createRole('view');
    Roles.createRole('resource');
    Roles.createRole('project-mgr');
  }

  // post user insert hook for settings default roles
  Meteor.users.after.insert((userId, user) => {
    // TODO: standardize post user inserts
    Roles.addUsersToRoles(user._id, defaults.roles);

    const count = Meteor.users.find().count();
    if (count <= 1) {
      _log('Make first user an admin...');
      Roles.addUsersToRoles(user._id, ['admin']);
    }
  });
}


// exposing roles for admin functions
Meteor.publish('roles.public', () => {
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

    // can't demote yourself
    if (role.indexOf('admin') >= 0 && userId === this.userId) {
      projekt.err('cantDemoteSelf');
      return false;
    }

    Roles.removeUsersFromRoles(userId, role);
    return true;
  },
});
