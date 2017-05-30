// core
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { _err, _log } from 'meteor/nihiven:projekt';

// collections
import { Profiles } from './profiles.js';

// imports from npm package
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

// exports
export const Comments = new Mongo.Collection('comments');
export { Comments as default };

if (Meteor.isServer) {
  Meteor.publish('comments.public', function(projectId) {
    check(projectId, String);
    return Comments.find({ projectId });
  });
}

// Deny all client-side updates
Comments.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// schema config
Comments.schema = new SimpleSchema({
  userId: {
    type: String,
    optional: false,
    label() { return 'The user id of the commenter.'; },
  },
  projectId: {
    type: String,
    optional: false,
    label() { return 'The project id the comment belongs to.'; },
  },
  comment: {
    type: String,
    optional: false,
    label() { return 'The comment.'; },
  },
  createdTime: {
    type: Date,
    optional: false,
    label() { return 'Time the task was created.'; },
  },
});
Comments.attachSchema(Comments.schema);

Comments.helpers({
  profile() {
    return Profiles.findOne({ userId: this.userId });
  },
  aLongLongTimeAgo() {
    if (this.createdTime !== undefined) {
      return moment(this.createdTime).fromNow();
    } else {
      return '';
    }
  },
});

Meteor.methods({
  'comments.new'(projectId, comment) {
    check(projectId, String);
    check(comment, String);

    // user must be logged in
    if (!this.userId) {
      _err('notAuthorized');
    }
    const result = Comments.insert({
      projectId,
      userId: this.userId,
      comment,
      createdTime: Date.now(),
    });
  },
});
