// TODO: ? mxab:simple-schema-jsdoc Generate jsdoc from your schemas.
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { projekt, defaults } from 'meteor/projekt';

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
}

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
  adminGlowOn: {
    type: Boolean,
    optional: true,
    label() { return 'Should the top menu glow if the user is an admin?'; },
  },
  adminGlowColor: {
    type: String,
    optional: true,
    label() { return 'The color of the top menu glow when the user is an admin.'; },
  },
});

// all calls to Profiles.insert(), update(), upsert(),
// will be automatically be checked against the schema
Profiles.attachSchema(Profiles.schema);

Meteor.methods({
  'profiles.save.adminGlowColor': function(colorHex) {
    check(colorHex, String);

    Profiles.update(
      { userId: this.userId },
      { $set: { userId: this.userId, adminGlowColor: colorHex } },
      { upsert: true, multi: false });
  },
  'profiles.upsert': function(data) {
    check(data, Match.Any);

    // user must be logged in
    if (!Meteor.userId()) {
      projekt.err('notLoggedIn');
    }

    // TODO: make sure this user owns the profile
    // OR has elevated priviliges

    // TODO: formatting :( ??
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
  'profiles.newUser'(user) {
    check(user, Object);

    // insert default values
    Profiles.insert({
      userId: user._id,
      name: user.emails[0].address, // NOTE: there will only be one here, so assume [0]
      email: user.emails[0].address,
      adminGlowOn: defaults.adminGlowOn,
      adminGlowColor: defaults.adminGlowColor,
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
