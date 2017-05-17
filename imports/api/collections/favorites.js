// TODO: schema

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { project, errors } from 'meteor/nihiven:projekt';

export const Favorites = new Mongo.Collection('favorites');
export { Favorites as default };

// imports from npm package
import SimpleSchema from 'simpl-schema';

if (Meteor.isServer) { // This code only runs on the server
  Meteor.publish('favorites.user', function() {
    return Favorites.find({ userId: this.userId });
  });
}

// Deny all client-side updates
Favorites.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// schema config
Favorites.schema = new SimpleSchema({
  userId: {
    type: String,
    optional: false,
    label() { return 'User ID'; },
  },
  projectId: {
    type: String,
    optional: false,
    label() { return 'Project ID'; },
  },
});
Favorites.attachSchema(Favorites.schema);

Meteor.methods({
  'favorites.toggle'(projectId) {
    check(projectId, String);

    // user must be logged in
    if (!this.userId) {
      project.err('notAuthorized');
    }

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
      project.err('notAuthorized');
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
      project.err('notAuthorized');
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
      project.err('notAuthorized');
    }
  },
});
