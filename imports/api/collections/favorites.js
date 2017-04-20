import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

export const Favorites = new Mongo.Collection('favorites');
export { Favorites as default };

if (Meteor.isServer) {
  // This code only runs on the server

  Meteor.publish('favorites', function() {
    return Favorites.find();
  });

  Meteor.publish('favoriteProjects', function(userId) { // eslint-disable-line
    return Favorites.aggregate([{
      $match: {
        owner: userId,
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: 'projectId',
        foreignField: '_id',
        as: 'favorite_projects',
      },
    },
    ]);
  });
}

Meteor.methods({
  'favorites.insert'(projectId) {
    check(projectId, Match.Any); // TODO: use object match

    // user must be logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Favorites.insert({
      projectId,
      owner: Meteor.userId(),
    });
  },
  'favorites.remove'(projectId) {
    check(projectId, Match.Any); // TODO: use object match

    // user must be logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Favorites.remove({
      projectId,
      owner: Meteor.userId(),
    });
  },
});

