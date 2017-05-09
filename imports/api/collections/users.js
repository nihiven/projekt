import { Meteor } from 'meteor/meteor';

Meteor.publish('Users.all', function () {
  return Meteor.users.find({});
});
