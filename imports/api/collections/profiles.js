// TODO: ? mxab:simple-schema-jsdoc Generate jsdoc from your schemas.
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

// imports from npm package
import SimpleSchema from 'simpl-schema';

// exports
export const Profiles = new Mongo.Collection('profiles');
export { Profiles as default };

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

// TODO: here is an exmaple of including a collection subset
/*
Profiles.helpers({
  todos() {
    return Todos.find({listId: this._id}, {sort: {createdAt: -1}});
  }
});
*/

Meteor.publish('profiles.user',(userId)=>{
  check(userId, Match.Any);
  console.log('publish: profiles.user');

  return Profiles.find({ _id: userId });
});

/*
Meteor.publish('user.settings',(userId)=> {
  check(userId, Match.Any);
  return Profiles.find(
    { _id: userId },
    { fields: { '_id': 1, 'displayName': 1, 'publicEmail': 1, 'officeLocation': 1, 'officePhone': 1 } });
});
*/

Meteor.methods({
  'profiles.upsert'(data) {
    check(data, Match.Any);

    console.log(data);
    
    // user must be logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    // TODO: formatting??
    Profiles.update(
      { userId: Meteor.userId() },
      {
        $set: {
          userId: Meteor.userId(),
          name: data.name,
          email: data.email,
          officeLocation: data.officeLocation,
          officePhone: data.officePhone,
        },
      },
      { upsert: true, multi: false });

    return true;
  },
});
