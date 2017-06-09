// TODO: sort out the reutrn values in the methods below.
// i'm not sure they're right and in fact am not sure
// what any of the monogo calls acutally return

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { defaults, _err, _log } from 'meteor/nihiven:projekt';

// node modules
import faker from 'faker';

// collections
import { Profiles } from './profiles.js';


if (Meteor.isServer) {
  Meteor.publish('users.public', () => { // not required
    return Meteor.users.find({}, { _id: 1, roles: 1, emails: 1 });
  });

  // post insert for user collection
  Meteor.users.after.insert((userId, user) => {
    _log('roles: user post');
    // TODO: standardize post user inserts
    Roles.addUsersToRoles(user._id, defaults.roles);

    const count = Meteor.users.find().count();
    if (count <= 1) {
      _log('Make first user an admin...');
      Roles.addUsersToRoles(user._id, ['admin']);
    }

    _log('profiles: user post');
    // TODO: standardize post user inserts
    Meteor.call('profiles.newUser', user);

    return true;
  });
}

Meteor.methods({
  'test.users.reset': function testUsersReset() {
    // user must be logged in
    if (!Meteor.userId()) {
      _err('notLoggedIn');
      return false;
    }

    // make sure this user has elevated priviliges
    if (Roles.adminCheckFails(this.userId)) {
      _err('notAdmin');
      return false;
    }

    _log('removing all users...');
    // TODO: this should be an accounts function
    Meteor.users.remove({ }, (error) => {
      if (error) {
        _log('error removing users');
        _log(error);
        return false;
      }

      _log('removed all users');
      return true;
    });

    return false; // ?
  },
  'test.users.load': function testUsersLoad() {
    // TODO: this should be accounts.createUser
    const userId = Meteor.users.insert({
      emails: [{ address: faker.fake('{{internet.email}}'), verified: false }],
      createdAt: Date.now(),
    });

    Profiles.update(
      { userId },
      {
        $set: {
          name: faker.fake('{{name.firstName}} {{name.lastName}}'),
          email: faker.fake('{{internet.email}}'),
          officeLocation: faker.fake('{{address.streetAddress}} '),
          officePhone: faker.fake('{{phone.phoneNumberFormat}}'),
        },
      },
      { upsert: true, multi: false });

    Roles.addUsersToRoles(userId, defaults.roles);
  },
  'users.remove': function usersRemove(userId) {
    check(userId, String);

    // user must be logged in
    if (!Meteor.userId()) {
      _err('notLoggedIn');
      return false;
    }

    // make sure this user has elevated priviliges
    if (Roles.adminCheckFails(this.userId)) {
      _err('notAdmin');
      return false;
    }

    _log('removing user...');
    // TODO: this should be an accounts function
    Meteor.users.remove({ _id: userId }, (error, docRemoved) => {
      if (error) {
        _log(`error removing user ${userId}`);
        return false;
      }

      _log(`removed user ${docRemoved}`);
      return true;
    });

    return true; // ?
  },
});
