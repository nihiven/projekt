import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
// TODO: end of day, adding schema and defining profile collection
// TODO: end of day, remove pubs and subs for Meteor.users
export const Profiles = new Mongo.Collection('profiles');
export { Profiles as default };

// This code only runs on the server
Meteor.publish('profiles.user',(userId)=>{
  check(userId, Match.Any);
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
