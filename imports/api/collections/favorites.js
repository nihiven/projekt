// TODO: schema

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

export const Favorites = new Mongo.Collection('favorites');
export { Favorites as default };

if (Meteor.isServer) { // This code only runs on the server
  Meteor.publish('favorites', function() {
    return Favorites.find();
  });
}

Meteor.methods({
  'favorites.insert'(projectId) {
    check(projectId, Match.Any); // TODO: use object match

    // user must be logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Favorites.insert({
      projectId,
      owner: this.userId(),
    });
  },
  'favorites.remove'(projectId) {
    check(projectId, Match.Any); // TODO: use object match

    // user must be logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Favorites.remove({
      projectId,
      owner: Meteor.userId(),
    });
  },
  'favorites.reset'() {
    if (Roles.userIsInRole( this.userId, ['admin'])) {
      Favorites.remove({});
    } else {
      throw new Meteor.Error(403, 'Not authorized to reset Favorite data.');
    }
  },
});
