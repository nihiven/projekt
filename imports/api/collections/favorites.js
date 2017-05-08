// TODO: schema

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

export const Favorites = new Mongo.Collection('favorites');
export { Favorites as default };

if (Meteor.isServer) { // This code only runs on the server
  Meteor.publish('favorites.user', function() {
    return Favorites.find({ userId: this.userId });
  });
}

Meteor.methods({
  'favorites.toggle'(projectId) {
    check(projectId, String);

    // TODO: does there need to be something more here?
    // only checking for empty, maybe it's enough
    if (Favorites.find({ projectId, userId: this.userId }).count() === 0) {
      Meteor.call('favorites.insert', projectId);
    } else {
      Meteor.call('favorites.remove', projectId);
    }
  },
  'favorites.insert'(projectId) {
    check(projectId, String);

    // user must be logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Favorites.insert({
      projectId,
      userId: this.userId,
    });
  },
  'favorites.remove'(projectId) {
    check(projectId, String);

    // user must be logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Favorites.remove({
      projectId,
      userId: this.userId,
    });
  },
  'favorites.reset'() {
    if (Roles.adminCheckPasses(this.userId)) {
      Favorites.remove({});
    } else {
      throw new Meteor.Error(403, 'Not authorized to reset Favorite data.');
    }
  },
});
