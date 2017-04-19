import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Favorites = new Mongo.Collection('favorites');
export { Favorites as default };

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('favorites', function(userId) {
    check(userId, Number);

    return Favorites.find({});
  });
}

Meteor.methods({
  'favorites.insert'(projectId) {
    check(projectId, Number);

    // user must be logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Favorites.insert({
      projectId,
      owner: Meteor.userId(),
    });

    console.log('created new project');
  },
});
