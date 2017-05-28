import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { defaults, _log } from 'meteor/nihiven:projekt';

// collections
import { Profiles } from './profiles.js';

// node modules
import faker from 'faker';

if (Meteor.isServer) {
  Meteor.publish('users.public', function () { // not required
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
  });
}

Meteor.methods({
  'users.testData'() {
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
  'users.remove'(userId) {
    check(userId, String);

    // user must be logged in
    if (!Meteor.userId()) {
      projekt.err('notLoggedIn');
      return false;
    }

    // make sure this user has elevated priviliges
    if (Roles.adminCheckFails(this.userId)) {
      projekt.err('notAdmin');
      return false;
    }

    _log('removing user...');
    // TODO: this should be an accounts function
    Users.remove({ _id: userId }, (error, docRemoved)=> {
      if (error) {
        _log(`error removing user ${userId}`);
        return false;
      } else {
        _log(`removed user ${docRemoved}`);
        return true;
      }
    });
  },
});
