import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Favorites = new Mongo.Collection('favorites');
export { Favorites as default };

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('favorites', function(userId) {
    check(userId, Number);

    return Favorites.find({ owner: userId });
  });
}

Meteor.methods({
  'favorites.insert'(name) {
    check(name, String);

    // user must be logged in
    // TODO: user must be project admin
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Favorites.insert({
      name,
      creator: Meteor.userId(),
      createdAt: new Date(),
    });

    console.log('created new project');
  },
});
