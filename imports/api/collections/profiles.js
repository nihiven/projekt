// TODO: ? mxab:simple-schema-jsdoc Generate jsdoc from your schemas.
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { projekt, _log } from 'meteor/nihiven:projekt';

// imports from npm package
import SimpleSchema from 'simpl-schema';

// exports
export const Profiles = new Mongo.Collection('profiles');
export { Profiles as default };

if (Meteor.isServer) {
  Meteor.publish('profiles.user', function() { // data for self consumption
    return Profiles.find({ userId: this.userId });
  });
  Meteor.publish('profiles.public', function() { // data for public consumption
    return Profiles.find({ }, { userId: 1, name: 1, email: 1 });
  });

  // post user insert hook for default profiles
  Meteor.users.after.insert((userId, user) => {
    // TODO: standardize post user inserts
    Meteor.call('profiles.newUser', user);
  });
} // isServer

// Deny all client-side updates
Profiles.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// define schema for user profile
// validate like this:
// Profiles.schema.validate(yourObject)
// a ValidationError is thrown if validate() fails
Profiles.schema = new SimpleSchema({
  // for type, use [String] to indicate an array
  userId: {
    type: String,
    optional: false,
    label() { return 'User ID'; },
  },
  name: {
    type: String,
    optional: true,
    label() { return 'Display Name'; },
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
    label() { return 'E-Mail Address'; },
  },
  officeLocation: {
    type: String,
    optional: true,
    label() { return 'Office Location'; },
  },
  officePhone: {
    type: String,
    optional: true,
    label() { return 'Office Phone'; },
  },
});

// all calls to Profiles.insert(), update(), upsert(),
// will be automatically be checked against the schema
Profiles.attachSchema(Profiles.schema);

Meteor.methods({
  'profiles.public'(userId) {
    check(userId, String);

    const data = Profiles.findOne({ userId }, { userId: 1, name: 1, email: 1 });
    return data;
  },
  'profiles.upsert': function(data) {
    check(data, Match.Any);

    // user must be logged in
    if (!Meteor.userId()) {
      projekt.err('notLoggedIn');
    }

    // make sure this user owns the profile OR has elevated priviliges
    if (Meteor.userId() !== this.userId  && Roles.adminCheckFails(this.userId)) {
      projekt.err('');
    }

    Profiles.update(
      { userId: this.userId },
      {
        $set: {
          userId: this.userId,
          name: data.displayName,
          email: data.publicEmail,
          officeLocation: data.officeLocation,
          officePhone: data.officePhone,
        },
      },
      { upsert: true, multi: false });

    return true;
  },
  'profiles.remove'(userId) {
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

    _log('removing profile...');
    Profiles.remove({ userId }, (error, docRemoved)=> {
      if (error) {
        _log(`error removing profile for user ${userId}`);
        return false;
      } else {
        _log(`removed profile for user ${docRemoved}`);
        return true;
      }
    });
  },
  'profiles.newUser'(user) {
    check(user, Object);

    // insert default values
    Profiles.insert({
      userId: user._id,
      name: user.emails[0].address, // NOTE: there will only be one here, so assume [0]
      email: user.emails[0].address,
    });

    return true;
  },
  'profiles.reset'() {
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      Profiles.remove({});
    } else {
      projekt.err('notAuthorized');
    }
  },
});
